import { getAppBaseUrl, isEmailSequenceConfigured } from "@/lib/email/config";
import { renderOnboardingEmail, SEQUENCE_LENGTH } from "@/lib/email/onboarding-emails";
import { sendEmail } from "@/lib/email/resend";
import { prisma } from "@/lib/db/prisma";
import { computeSentTransition } from "@/lib/services/email-sequence";

const CLAIM_WINDOW_MS = 6 * 60 * 60 * 1000; // 6h
const BATCH = 100;
// Tras 3 fallos de envío del MISMO correo se deja de reintentar (evita
// martillar un correo inválido y dañar la reputación del dominio).
const MAX_ATTEMPTS = 3;

export type SequenceRunResult = {
  processed: number;
  sent: number;
  failed: number;
  skipped: number;
};

// Procesa el drip: envía el correo pendiente/atrasado de cada usuario, avanza
// el step y reprograma el siguiente. Idempotente y seguro ante corridas que se
// solapen (claim atómico por fila). Pensado para el cron diario.
export async function runOnboardingSequence(
  now: Date = new Date(),
): Promise<SequenceRunResult> {
  if (!isEmailSequenceConfigured()) {
    throw new Error(
      "Secuencia de email no configurada (falta RESEND_API_KEY o EMAIL_FROM).",
    );
  }

  const baseUrl = getAppBaseUrl();

  const due = await prisma.emailSequenceState.findMany({
    where: {
      status: { in: ["pending", "failed"] },
      nextSendAt: { lte: now },
      attempts: { lt: MAX_ATTEMPTS },
    },
    orderBy: { nextSendAt: "asc" },
    take: BATCH,
  });

  let sent = 0;
  let failed = 0;
  let skipped = 0;

  for (const state of due) {
    // Claim atómico: si otra corrida ya tomó esta fila (mismo step/estado y
    // vencida), este update afecta 0 filas y la saltamos. El claim empuja
    // nextSendAt al futuro para que no la re-tome nadie mientras se envía.
    const claim = await prisma.emailSequenceState.updateMany({
      where: {
        id: state.id,
        step: state.step,
        status: state.status,
        nextSendAt: { lte: now },
      },
      data: { nextSendAt: new Date(now.getTime() + CLAIM_WINDOW_MS) },
    });

    if (claim.count !== 1) {
      skipped++;
      continue;
    }

    // Guard: sin correos más allá de la secuencia.
    if (state.step >= SEQUENCE_LENGTH) {
      await prisma.emailSequenceState.update({
        where: { id: state.id },
        data: { status: "done" },
      });
      continue;
    }

    try {
      const { subject, html } = renderOnboardingEmail(state.step, {
        baseUrl,
        unsubscribeToken: state.unsubscribeToken,
      });
      const unsubscribeUrl = `${baseUrl}/api/unsubscribe?token=${encodeURIComponent(
        state.unsubscribeToken,
      )}`;

      await sendEmail({
        to: state.email,
        subject,
        html,
        // RFC 8058: baja de un clic desde Gmail/Outlook/Apple Mail.
        headers: {
          "List-Unsubscribe": `<${unsubscribeUrl}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
        // Idempotencia real en Resend: si un reintento repite el mismo correo,
        // no se entrega dos veces.
        idempotencyKey: `onboarding-${state.id}-step-${state.step}`,
      });

      const next = computeSentTransition(state.step, state.createdAt);
      await prisma.emailSequenceState.update({
        where: { id: state.id },
        data: {
          step: next.step,
          status: next.status,
          nextSendAt: next.nextSendAt,
          lastSentAt: now,
          attempts: 0, // presupuesto de reintentos fresco para el próximo correo
        },
      });
      sent++;
    } catch (error) {
      console.error(
        `[email-sequence] Falló el envío a ${state.email} (step ${state.step}):`,
        error,
      );
      // No se avanza el step → se reintenta el MISMO correo en la próxima
      // corrida, hasta MAX_ATTEMPTS.
      await prisma.emailSequenceState.update({
        where: { id: state.id },
        data: {
          status: "failed",
          nextSendAt: now,
          attempts: state.attempts + 1,
        },
      });
      failed++;
    }
  }

  return { processed: due.length, sent, failed, skipped };
}
