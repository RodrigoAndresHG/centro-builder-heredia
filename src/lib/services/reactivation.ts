// Reglas puras del nudge de reactivación (testeables sin DB).

import { SEQUENCE_MAX_ATTEMPTS } from "@/lib/services/email-sequence";

export const NUDGE_INACTIVITY_DAYS = 6;
export const NUDGE_MAX_AGE_DAYS = 30;
// No enviar el nudge si el drip de onboarding mandó un correo hace <72h
// (evitar sensación de spam por correos encimados).
export const NUDGE_DRIP_SPACING_HOURS = 72;

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

export type NudgeVariant = "inactivo" | "sin-empezar";

export type DripSnapshot = {
  status: string;
  lastSentAt: Date | null;
  attempts: number;
};

// ¿El estado del drip permite mandar el nudge ahora?
// - unsubscribed → nunca (baja compartida).
// - pending → el drip sigue en vuelo (días 0-7); el nudge espera a que termine.
// - failed con reintentos pendientes → también sigue en vuelo (el drip va a
//   reintentar ese correo); solo un failed agotado (attempts >= tope) libera.
// - lastSentAt hace <72h → diferir (no encimar correos).
export function canSendNudgeGivenDrip(drip: DripSnapshot, now: Date): boolean {
  if (drip.status === "unsubscribed" || drip.status === "pending") {
    return false;
  }

  if (drip.status === "failed" && drip.attempts < SEQUENCE_MAX_ATTEMPTS) {
    return false;
  }

  if (
    drip.lastSentAt &&
    now.getTime() - drip.lastSentAt.getTime() <
      NUDGE_DRIP_SPACING_HOURS * HOUR_MS
  ) {
    return false;
  }

  return true;
}

// Ventana de elegibilidad: la última actividad (o el registro, para quien
// nunca empezó) debe tener entre 6 y 30 días. Menos de 6 → aún activo;
// más de 30 → demasiado frío (no spamear usuarios viejos al desplegar).
export function isWithinNudgeWindow(reference: Date, now: Date): boolean {
  const age = now.getTime() - reference.getTime();
  return age >= NUDGE_INACTIVITY_DAYS * DAY_MS && age <= NUDGE_MAX_AGE_DAYS * DAY_MS;
}
