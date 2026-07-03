import { randomBytes } from "node:crypto";

import { prisma } from "@/lib/db/prisma";
import {
  SEQUENCE_DAY_OFFSETS,
  SEQUENCE_LENGTH,
} from "@/lib/email/onboarding-emails";

// Este módulo es LIGERO a propósito (no importa Resend), para poder llamarse
// desde events.createUser sin arrastrar el SDK de email al bundle del auth.

const DAY_MS = 24 * 60 * 60 * 1000;

// Fecha de envío del correo `step`, anclada a la inscripción (sin drift).
export function computeNextSendAt(createdAt: Date, step: number): Date {
  const offset =
    SEQUENCE_DAY_OFFSETS[step] ??
    SEQUENCE_DAY_OFFSETS[SEQUENCE_DAY_OFFSETS.length - 1];
  return new Date(createdAt.getTime() + offset * DAY_MS);
}

export type SentTransition = {
  step: number;
  status: "pending" | "done";
  nextSendAt: Date;
};

// Estado resultante tras enviar con éxito el correo del `currentStep`.
export function computeSentTransition(
  currentStep: number,
  createdAt: Date,
): SentTransition {
  const nextStep = currentStep + 1;
  const done = nextStep >= SEQUENCE_LENGTH;
  return {
    step: nextStep,
    status: done ? "done" : "pending",
    // Si terminó, nextSendAt ya no importa; se deja anclado a createdAt.
    nextSendAt: done ? createdAt : computeNextSendAt(createdAt, nextStep),
  };
}

// Inscribe a un usuario en el drip. Idempotente: si ya tiene estado, no lo
// duplica ni lo reinicia. El correo 1 sale en la próxima corrida del cron.
export async function enrollUserInOnboarding(
  userId: string,
  email: string | null | undefined,
): Promise<void> {
  if (!email) {
    return;
  }

  await prisma.emailSequenceState.upsert({
    where: { userId },
    create: {
      userId,
      email,
      step: 0,
      status: "pending",
      nextSendAt: new Date(),
      unsubscribeToken: randomBytes(24).toString("hex"),
    },
    update: {},
  });
}

// Da de baja por token (link del pie de los correos). Detiene envíos futuros.
// Idempotente: devuelve true si el token existe.
export async function unsubscribeByToken(token: string): Promise<boolean> {
  if (!token) {
    return false;
  }

  const result = await prisma.emailSequenceState.updateMany({
    where: { unsubscribeToken: token },
    data: { status: "unsubscribed" },
  });

  return result.count > 0;
}
