import { Resend } from "resend";

import { getEmailFrom } from "./config";

let client: Resend | null = null;

function getResend(): Resend {
  client ??= new Resend(process.env.RESEND_API_KEY);
  return client;
}

// Envía un correo transaccional vía Resend. Lanza si falla (el cron lo maneja).
// idempotencyKey: evita doble-envío si un reintento repite el mismo correo.
// headers: extra (ej. List-Unsubscribe para deliverability/one-click).
export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
  headers?: Record<string, string>;
  idempotencyKey?: string;
}): Promise<void> {
  const from = getEmailFrom();
  if (!from) {
    throw new Error("EMAIL_FROM no está configurado.");
  }

  const { error } = await getResend().emails.send(
    {
      from,
      to: params.to,
      subject: params.subject,
      html: params.html,
      headers: params.headers,
    },
    params.idempotencyKey ? { idempotencyKey: params.idempotencyKey } : undefined,
  );

  if (error) {
    throw new Error(`Resend: ${error.message}`);
  }
}
