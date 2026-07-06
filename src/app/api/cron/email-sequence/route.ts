import { timingSafeEqual } from "node:crypto";

import { NextResponse } from "next/server";

import { runReactivationNudges } from "@/lib/email/run-nudges";
import { runOnboardingSequence } from "@/lib/email/run-sequence";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Margen para los dos batches de envíos vía Resend (drip + nudges).
export const maxDuration = 120;

// Vercel Cron envía Authorization: Bearer ${CRON_SECRET} cuando la env existe.
// También sirve para invocarlo manualmente en dev con el mismo header.
function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) {
    return false;
  }

  const provided = request.headers.get("authorization") ?? "";
  const expected = `Bearer ${secret}`;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);

  if (a.length !== b.length) {
    return false;
  }

  return timingSafeEqual(a, b);
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    // Primero el drip (prioridad), luego los nudges de reactivación. El
    // nudge respeta lo que el drip acaba de enviar (espaciado de 72h).
    const sequence = await runOnboardingSequence();

    let nudges;
    try {
      nudges = await runReactivationNudges();
    } catch (error) {
      // El fallo de nudges no debe tumbar el reporte del drip.
      console.error("[cron/email-sequence] Nudges fallaron:", error);
      nudges = { candidates: 0, sent: 0, skipped: 0, failed: -1 };
    }

    return NextResponse.json({ ok: true, sequence, nudges });
  } catch (error) {
    console.error("[cron/email-sequence] Error:", error);
    return NextResponse.json(
      { error: "Falló la corrida de la secuencia." },
      { status: 500 },
    );
  }
}
