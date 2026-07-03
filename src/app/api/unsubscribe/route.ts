import { NextResponse } from "next/server";

import { unsubscribeByToken } from "@/lib/services/email-sequence";

// Baja de un clic (RFC 8058). Gmail/Outlook/Apple Mail hacen POST aquí desde
// el header List-Unsubscribe-Post, sin que el usuario abra el navegador.
export const runtime = "nodejs";

export async function POST(request: Request) {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  await unsubscribeByToken(token);
  // RFC 8058 espera 200 aunque el token no exista (no revelar validez).
  return new NextResponse(null, { status: 200 });
}

// Si alguien abre el link en el navegador (GET), lo mandamos a la página con
// confirmación en vez de procesar la baja directamente.
export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  const target = token
    ? `/unsubscribe?token=${encodeURIComponent(token)}`
    : "/unsubscribe";
  return NextResponse.redirect(new URL(target, request.url));
}
