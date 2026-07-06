import { randomBytes } from "node:crypto";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import {
  canViewerOpenProgram,
  type LearningViewer,
} from "@/lib/services/access-control";
import { listProgramsForViewer } from "@/lib/services/learning";
import { getProgramProgress } from "@/lib/services/progress";

// Estructura mínima que getProgramProgress necesita para calcular el 100%.
export async function getProgramWithLessons(programSlug: string) {
  return prisma.program.findUnique({
    where: { slug: programSlug, isPublished: true },
    select: {
      id: true,
      productId: true,
      slug: true,
      title: true,
      modules: {
        where: { isPublished: true },
        orderBy: { sortOrder: "asc" },
        select: {
          id: true,
          slug: true,
          title: true,
          lessons: {
            where: { isPublished: true },
            orderBy: { sortOrder: "asc" },
            select: { id: true, slug: true, title: true, sortOrder: true },
          },
        },
      },
    },
  });
}

export type CertificateIssueResult =
  | { status: "not-found" }
  | { status: "locked" }
  | { status: "incomplete" }
  | { status: "needs-name" }
  | {
      status: "issued";
      certificate: {
        code: string;
        recipientName: string;
        issuedAt: Date;
        programTitle: string;
      };
    };

// Emite (o devuelve) el certificado del usuario para un programa. Idempotente:
// una sola fila por usuario+programa. Requiere ACCESO VIGENTE al programa
// (misma regla que abrir una lección), 100% de lecciones publicadas
// completadas y un nombre en el perfil (el cert es público).
export async function getOrIssueCertificate(
  viewer: LearningViewer,
  programSlug: string,
): Promise<CertificateIssueResult> {
  const userId = viewer.id;
  const program = await getProgramWithLessons(programSlug);
  if (!program) {
    return { status: "not-found" };
  }

  // Sin acceso vigente no se emite NI se muestra (evita certificados tras un
  // acceso expirado y no revela el estado de programas bloqueados).
  const allowed = await canViewerOpenProgram(viewer, {
    id: program.id,
    productId: program.productId,
  });
  if (!allowed) {
    return { status: "locked" };
  }

  const existing = await prisma.certificate.findUnique({
    where: { userId_programId: { userId, programId: program.id } },
  });
  if (existing) {
    return {
      status: "issued",
      certificate: {
        code: existing.code,
        recipientName: existing.recipientName,
        issuedAt: existing.issuedAt,
        programTitle: program.title,
      },
    };
  }

  const progress = await getProgramProgress(userId, program);
  if (!progress.isComplete) {
    return { status: "incomplete" };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true },
  });
  const recipientName = user?.name?.trim() ?? "";
  if (recipientName.length < 2) {
    return { status: "needs-name" };
  }

  try {
    const created = await prisma.certificate.create({
      data: {
        userId,
        programId: program.id,
        recipientName,
        // 16 hex chars aleatorios: no adivinable, corto para compartir.
        code: randomBytes(8).toString("hex"),
      },
    });

    return {
      status: "issued",
      certificate: {
        code: created.code,
        recipientName: created.recipientName,
        issuedAt: created.issuedAt,
        programTitle: program.title,
      },
    };
  } catch (error) {
    // Carrera entre dos requests simultáneos: gana el primero.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const winner = await prisma.certificate.findUnique({
        where: { userId_programId: { userId, programId: program.id } },
      });
      if (winner) {
        return {
          status: "issued",
          certificate: {
            code: winner.code,
            recipientName: winner.recipientName,
            issuedAt: winner.issuedAt,
            programTitle: program.title,
          },
        };
      }
    }
    throw error;
  }
}

// Certificado público por código (para /cert/[code]).
export async function getCertificateByCode(code: string) {
  if (!/^[a-f0-9]{16}$/.test(code)) {
    return null;
  }

  return prisma.certificate.findUnique({
    where: { code },
    select: {
      recipientName: true,
      issuedAt: true,
      revokedAt: true,
      code: true,
      program: { select: { title: true } },
    },
  });
}

// "Siguiente peldaño": el primer programa comprable (con producto) que el
// usuario aún no puede abrir, en el orden del catálogo. Excluye además los
// productos con CUALQUIER compra del usuario, para no ofrecer lo recién
// comprado mientras el webhook de Stripe todavía no activa el acceso.
export async function getNextStepProgram(viewer: LearningViewer) {
  const [{ lockedPrograms }, purchases] = await Promise.all([
    listProgramsForViewer(viewer),
    prisma.purchase.findMany({
      where: { userId: viewer.id, productId: { not: null } },
      select: { productId: true },
    }),
  ]);

  const purchasedProductIds = new Set(
    purchases.map((purchase) => purchase.productId),
  );

  return (
    lockedPrograms.find(
      (program) =>
        program.product?.slug && !purchasedProductIds.has(program.productId),
    ) ?? null
  );
}
