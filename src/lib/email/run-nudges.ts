import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import { getAppBaseUrl, isEmailSequenceConfigured } from "@/lib/email/config";
import { renderBrandedEmail } from "@/lib/email/onboarding-emails";
import { sendEmail } from "@/lib/email/resend";
import { ensureUnsubscribeToken } from "@/lib/services/email-sequence";
import { listProgramsForViewer } from "@/lib/services/learning";
import { getProgramProgress } from "@/lib/services/progress";
import {
  canSendNudgeGivenDrip,
  isWithinNudgeWindow,
  NUDGE_INACTIVITY_DAYS,
  NUDGE_MAX_AGE_DAYS,
  type NudgeVariant,
} from "@/lib/services/reactivation";

// Máximo de nudges por corrida (presupuesto de tiempo del cron).
const BATCH = 50;

const DAY_MS = 24 * 60 * 60 * 1000;

export type NudgeRunResult = {
  candidates: number;
  sent: number;
  skipped: number;
  failed: number;
};

type NudgeContent = {
  subject: string;
  paragraphs: string[];
  ctaLabel: string;
};

function buildContent(
  variant: NudgeVariant,
  firstName: string | null,
  programTitle: string,
  lessonTitle: string,
): NudgeContent {
  const saludo = firstName ? `${firstName}, te` : "Te";

  if (variant === "sin-empezar") {
    return {
      subject: "Tu acceso sigue esperándote",
      paragraphs: [
        `${saludo} registraste en Builder HeredIA hace unos días y tu primera lección sigue intacta.`,
        `Se llama «${lessonTitle}» y toma pocos minutos. Sales con algo que casi nadie que "usa IA" entiende.`,
        "No necesitas tarjeta ni preparación. Solo entrar y empezar.",
      ],
      ctaLabel: "Empezar mi primera lección →",
    };
  }

  return {
    subject: "Tu build quedó en pausa — retómalo en 2 minutos",
    paragraphs: [
      `${saludo} quedaste a mitad de «${programTitle}» y llevas un avance real.`,
      `Tu siguiente lección es «${lessonTitle}». Está exactamente donde la dejaste.`,
      "Retomar es lo que separa a quien aprende IA de quien construye con ella.",
    ],
    ctaLabel: "Retomar donde quedé →",
  };
}

function firstNameOf(name: string | null): string | null {
  const first = name?.trim().split(/\s+/)[0];
  return first && first.length > 1 ? first : null;
}

// Envía a lo sumo UN nudge por usuario (fila única en reactivation_nudges como
// claim). Dos variantes: "inactivo" (tiene progreso, parado 6-30 días) y
// "sin-empezar" (registrado hace 6-30 días, cero progreso). Respeta el drip
// (no encimarse) y el unsubscribe compartido.
export async function runReactivationNudges(
  now: Date = new Date(),
): Promise<NudgeRunResult> {
  if (!isEmailSequenceConfigured()) {
    throw new Error(
      "Nudges no configurados (falta RESEND_API_KEY o EMAIL_FROM).",
    );
  }

  const baseUrl = getAppBaseUrl();
  const windowStart = new Date(now.getTime() - NUDGE_MAX_AGE_DAYS * DAY_MS);
  const windowEnd = new Date(now.getTime() - NUDGE_INACTIVITY_DAYS * DAY_MS);

  // Nota sobre `emailSequence: { isNot: { status: "unsubscribed" } }`: en
  // Prisma, isNot sobre una relación 1-1 nullable TAMBIÉN incluye a los
  // usuarios SIN fila de drip (relación null). Eso es intencional: los
  // usuarios pre-drip son elegibles; ensureUnsubscribeToken les crea su fila
  // (status done) y canSendNudgeGivenDrip re-verifica el estado real.

  // Candidatos "inactivo": con progreso, pero nada en los últimos 6 días y
  // algo dentro de los últimos 30. Sin nudge previo y sin baja del drip.
  const inactive = await prisma.user.findMany({
    where: {
      email: { not: null },
      roleKey: { not: "ADMIN" },
      lessonProgress: {
        some: { completedAt: { gte: windowStart } },
        none: { completedAt: { gt: windowEnd } },
      },
      emailSequence: { isNot: { status: "unsubscribed" } },
    },
    select: { id: true, name: true, email: true, roleKey: true },
    take: BATCH,
  });

  // Candidatos "sin-empezar": registrados hace 6-30 días, cero progreso.
  const neverStarted = await prisma.user.findMany({
    where: {
      email: { not: null },
      roleKey: { not: "ADMIN" },
      createdAt: { gte: windowStart, lte: windowEnd },
      lessonProgress: { none: {} },
      emailSequence: { isNot: { status: "unsubscribed" } },
    },
    select: { id: true, name: true, email: true, roleKey: true, createdAt: true },
    take: BATCH,
  });

  // Excluir a quienes ya recibieron SU nudge (único de por vida).
  const allIds = [...inactive, ...neverStarted].map((user) => user.id);
  const alreadyNudged = new Set(
    (
      await prisma.reactivationNudge.findMany({
        where: { userId: { in: allIds } },
        select: { userId: true },
      })
    ).map((row) => row.userId),
  );

  const inactiveQueue = inactive
    .filter((user) => !alreadyNudged.has(user.id))
    .map((user) => ({
      user: { ...user, email: user.email as string },
      variant: "inactivo" as const,
      reference: null as Date | null, // la ventana ya la garantiza la query
    }));
  const neverStartedQueue = neverStarted
    .filter((user) => !alreadyNudged.has(user.id))
    .map((user) => ({
      user: { ...user, email: user.email as string },
      variant: "sin-empezar" as const,
      reference: user.createdAt as Date | null,
    }));

  // Reparto justo del batch: mitad para cada variante; si una tiene menos
  // candidatos, la otra usa el espacio sobrante (evita que "sin-empezar"
  // muera de hambre cuando hay muchos inactivos, y viceversa).
  const half = Math.floor(BATCH / 2);
  const takeInactive = Math.min(
    inactiveQueue.length,
    Math.max(half, BATCH - neverStartedQueue.length),
  );
  const queue = [
    ...inactiveQueue.slice(0, takeInactive),
    ...neverStartedQueue.slice(0, BATCH - takeInactive),
  ];

  let sent = 0;
  let skipped = 0;
  let failed = 0;

  for (const { user, variant, reference } of queue) {
    try {
      if (reference && !isWithinNudgeWindow(reference, now)) {
        skipped++;
        continue;
      }

      // Token de baja + estado del drip (sin inscribir al drip).
      const drip = await ensureUnsubscribeToken(user.id, user.email);
      if (!canSendNudgeGivenDrip(drip, now)) {
        skipped++;
        continue;
      }

      // Deep link a la lección exacta (siguiente paso del primer programa
      // disponible para este usuario).
      const { availablePrograms } = await listProgramsForViewer({
        id: user.id,
        role: user.roleKey,
      });
      const program = availablePrograms.find(
        (candidate) => candidate.modules.some((m) => m.lessons.length > 0),
      );
      if (!program) {
        skipped++;
        continue;
      }

      const progress = await getProgramProgress(user.id, program);
      if (progress.isComplete || !progress.nextLesson) {
        skipped++;
        continue;
      }

      // Claim de idempotencia ANTES de enviar (userId único).
      try {
        await prisma.reactivationNudge.create({
          data: { userId: user.id, email: user.email, variant },
        });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002"
        ) {
          skipped++; // otra corrida lo reclamó
          continue;
        }
        throw error;
      }

      const content = buildContent(
        variant,
        firstNameOf(user.name),
        program.title,
        progress.nextLesson.lesson.title,
      );
      const utm = new URLSearchParams({
        utm_source: "email",
        utm_medium: "nudge",
        utm_campaign: "reactivacion",
        utm_content: variant,
      });
      const ctaHref = `${baseUrl}${progress.nextLesson.href}?${utm.toString()}`;
      const unsubscribeHref = `${baseUrl}/unsubscribe?token=${encodeURIComponent(drip.token)}`;

      // El claim NO se libera si el envío falla: preferimos perder un nudge
      // (es marketing, no transaccional) antes que arriesgar un doble envío
      // (el "fallo" pudo ser un timeout con el correo ya aceptado por Resend).
      await sendEmail({
        to: user.email,
        subject: content.subject,
        html: renderBrandedEmail({
          paragraphs: content.paragraphs,
          ctaLabel: content.ctaLabel,
          ctaHref,
          closing: ["Rodrigo"],
          unsubscribeHref,
        }),
        headers: {
          "List-Unsubscribe": `<${baseUrl}/api/unsubscribe?token=${encodeURIComponent(drip.token)}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
        idempotencyKey: `nudge-${user.id}`,
      });
      sent++;
    } catch (error) {
      console.error(
        `[nudges] Falló el nudge (${variant}) a ${user.email}:`,
        error,
      );
      failed++;
    }
  }

  return { candidates: queue.length, sent, skipped, failed };
}
