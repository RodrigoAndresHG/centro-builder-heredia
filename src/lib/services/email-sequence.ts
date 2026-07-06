import { randomBytes } from "node:crypto";

import { prisma } from "@/lib/db/prisma";
import {
  SEQUENCE_DAY_OFFSETS,
  SEQUENCE_LENGTH,
} from "@/lib/email/onboarding-emails";

// Este módulo es LIGERO a propósito (no importa Resend), para poder llamarse
// desde events.createUser sin arrastrar el SDK de email al bundle del auth.

const DAY_MS = 24 * 60 * 60 * 1000;

// Tope de reintentos de envío por correo del drip. Compartido con el nudge de
// reactivación: un drip en "failed" con reintentos pendientes sigue EN VUELO.
export const SEQUENCE_MAX_ATTEMPTS = 3;

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

// Garantiza que el usuario tenga un token de baja SIN inscribirlo al drip:
// si no tiene estado, se crea uno ya terminado (status done, step final).
// Lo usa el nudge de reactivación para usuarios anteriores al drip.
export async function ensureUnsubscribeToken(
  userId: string,
  email: string,
): Promise<{
  token: string;
  status: string;
  lastSentAt: Date | null;
  attempts: number;
}> {
  const state = await prisma.emailSequenceState.upsert({
    where: { userId },
    create: {
      userId,
      email,
      step: SEQUENCE_LENGTH,
      status: "done",
      nextSendAt: new Date(),
      unsubscribeToken: randomBytes(24).toString("hex"),
    },
    // update vacío a propósito: NUNCA modifica una fila existente (ni
    // lastSentAt ni status) — solo la lee. Los valores devueltos reflejan
    // lo que el drip haya hecho, incluso en esta misma corrida del cron.
    update: {},
    select: {
      unsubscribeToken: true,
      status: true,
      lastSentAt: true,
      attempts: true,
    },
  });

  return {
    token: state.unsubscribeToken,
    status: state.status,
    lastSentAt: state.lastSentAt,
    attempts: state.attempts,
  };
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
