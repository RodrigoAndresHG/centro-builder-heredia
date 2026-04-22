import { prisma } from "@/lib/db/prisma";
import { isAdminRole } from "@/lib/permissions";

export type LearningViewer = {
  id: string;
  role?: string | null;
};

export type AccessDecision = "allowed" | "locked";

type ProgramAccessSubject = {
  id: string;
  productId: string | null;
};

export async function hasActiveProductAccess(
  userId: string,
  productId: string,
) {
  const access = await prisma.access.findFirst({
    where: {
      userId,
      productId,
      status: "ACTIVE",
      startsAt: { lte: new Date() },
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    },
  });

  return Boolean(access);
}

export async function hasActiveProgramAccess(
  userId: string,
  programId: string,
) {
  const access = await prisma.access.findFirst({
    where: {
      userId,
      programId,
      status: "ACTIVE",
      startsAt: { lte: new Date() },
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    },
  });

  return Boolean(access);
}

export async function canViewerOpenProgram(
  viewer: LearningViewer,
  program: ProgramAccessSubject,
) {
  if (isAdminRole(viewer.role)) {
    return true;
  }

  if (!program.productId) {
    return true;
  }

  const [hasProductAccess, hasProgramAccess] = await Promise.all([
    hasActiveProductAccess(viewer.id, program.productId),
    hasActiveProgramAccess(viewer.id, program.id),
  ]);

  return hasProductAccess || hasProgramAccess;
}
