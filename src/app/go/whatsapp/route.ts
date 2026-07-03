import { NextResponse } from "next/server";

import { normalizeSrc } from "@/lib/attribution";
import { getCommunityUrl } from "@/lib/community";
import { prisma } from "@/lib/db/prisma";

// Redirect interno para medir clics al canal de WhatsApp (que no acepta UTMs).
// Registra el evento por fuente y luego 302 al canal. Nunca bloquea el
// redirect si el registro falla.
export const runtime = "nodejs";

export async function GET(request: Request) {
  const src = normalizeSrc(new URL(request.url).searchParams.get("src"));

  try {
    await prisma.linkClickEvent.create({
      data: { target: "whatsapp", src },
    });
  } catch (error) {
    console.error("[go/whatsapp] No se pudo registrar el clic:", error);
  }

  return NextResponse.redirect(getCommunityUrl(), 302);
}
