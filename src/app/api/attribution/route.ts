import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { recordAttributionEvent } from "@/lib/services/attribution";
import { attributionSchema } from "@/lib/validators/attribution";
import {
  ATTRIBUTION_COOKIE,
  ATTRIBUTION_COOKIE_MAX_AGE,
} from "@/lib/attribution/cookie";

/**
 * Registra un click atribuido (UTMs de tráfico entrante) y deja una cookie
 * para que el signup posterior asocie la fuente a la cuenta. Idempotente en la
 * práctica: el cliente solo lo llama una vez por llegada con UTMs.
 */
export async function POST(request: Request) {
  const rawBody = await request.json().catch(() => null);
  const parsed = attributionSchema.safeParse(rawBody);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error:
          parsed.error.issues[0]?.message ?? "Atribución no válida.",
      },
      { status: 400 },
    );
  }

  try {
    await recordAttributionEvent(parsed.data, {
      userAgent: request.headers.get("user-agent"),
    });

    const jar = await cookies();
    jar.set(ATTRIBUTION_COOKIE, JSON.stringify(parsed.data), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: ATTRIBUTION_COOKIE_MAX_AGE,
      path: "/",
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "No se pudo registrar la atribución." },
      { status: 500 },
    );
  }
}
