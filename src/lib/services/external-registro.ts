import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";

export const EXTERNAL_SIGNUP_RATE_LIMIT = 5; // por IP y por minuto

type RegisterInput = {
  email: string;
  signupSource: string;
};

// Crea el usuario como INVITADO si no existe. Nunca duplica: si el correo
// ya está registrado, lo deja intacto. Devuelve si fue alta nueva.
export async function registerExternalUser({
  email,
  signupSource,
}: RegisterInput): Promise<{ isNew: boolean }> {
  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existing) {
    return { isNew: false };
  }

  try {
    await prisma.user.create({
      data: { email, roleKey: "INVITADO", signupSource },
    });
    return { isNew: true };
  } catch (error) {
    // Carrera: otro request creó el mismo correo entre el find y el create.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { isNew: false };
    }
    throw error;
  }
}

// Rate limit serverless-safe por IP y minuto. Devuelve true si la petición
// está dentro del límite. El contador vive en la DB (el proceso serverless
// no conserva estado entre invocaciones).
export async function consumeExternalSignupRateLimit(
  ip: string,
  limit = EXTERNAL_SIGNUP_RATE_LIMIT,
): Promise<boolean> {
  const minute = new Date().toISOString().slice(0, 16); // "2026-06-11T20:31"
  const bucket = `${ip}:${minute}`;

  const row = await prisma.externalSignupThrottle.upsert({
    where: { bucket },
    update: { count: { increment: 1 } },
    create: { bucket, count: 1 },
  });

  return row.count <= limit;
}
