import { timingSafeEqual } from "node:crypto";

import { NextResponse } from "next/server";

import { runOnboardingSequence } from "@/lib/email/run-sequence";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Margen para el batch de envíos vía Resend.
export const maxDuration = 60;

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
    const result = await runOnboardingSequence();
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error("[cron/email-sequence] Error:", error);
    return NextResponse.json(
      { error: "Falló la corrida de la secuencia." },
      { status: 500 },
    );
  }
}
