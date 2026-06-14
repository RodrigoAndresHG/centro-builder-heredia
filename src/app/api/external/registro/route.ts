import { timingSafeEqual } from "node:crypto";

import { NextResponse } from "next/server";

import { signIn } from "@/lib/auth";
import { PRONOSTIGOL_BASE_URL, PRONOSTIGOL_ORIGIN } from "@/lib/external/config";
import {
  consumeExternalSignupRateLimit,
  registerExternalUser,
} from "@/lib/services/external-registro";
import { externalRegistroSchema } from "@/lib/validators";

// Usa node:crypto, Prisma (adaptador pg) y Nodemailer → runtime Node, no Edge.
export const runtime = "nodejs";

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": PRONOSTIGOL_ORIGIN,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-API-Key",
  "Access-Control-Max-Age": "86400",
  Vary: "Origin",
};

function corsJson(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: CORS_HEADERS });
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

// Comparación en tiempo constante para no filtrar la API key por timing.
function isValidApiKey(provided: string | null, expected: string): boolean {
  if (!provided) {
    return false;
  }

  const a = Buffer.from(provided);
  const b = Buffer.from(expected);

  if (a.length !== b.length) {
    return false;
  }

  return timingSafeEqual(a, b);
}

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function isEmailConfigured(): boolean {
  return Boolean(process.env.EMAIL_SERVER && process.env.EMAIL_FROM);
}

export async function POST(request: Request) {
  const expectedKey = process.env.EXTERNAL_API_KEY?.trim();

  if (!expectedKey) {
    console.error("[external/registro] EXTERNAL_API_KEY no está configurada");
    return corsJson({ error: "El endpoint no está configurado." }, 503);
  }

  if (!isValidApiKey(request.headers.get("x-api-key"), expectedKey)) {
    return corsJson({ error: "No autorizado." }, 401);
  }

  if (!isEmailConfigured()) {
    console.error("[external/registro] Falta EMAIL_SERVER/EMAIL_FROM");
    return corsJson(
      { error: "El envío de correo no está configurado." },
      503,
    );
  }

  // Rate limit básico por IP (5/min) para evitar abuso del envío de correos.
  const ip = getClientIp(request);
  const withinLimit = await consumeExternalSignupRateLimit(ip);
  if (!withinLimit) {
    return corsJson(
      { error: "Demasiadas solicitudes. Intenta de nuevo en un minuto." },
      429,
    );
  }

  const rawBody = await request.json().catch(() => null);
  const parsed = externalRegistroSchema.safeParse(rawBody);
  if (!parsed.success) {
    return corsJson(
      { error: parsed.error.issues[0]?.message ?? "Datos inválidos." },
      400,
    );
  }

  const { email, signupSource, partidoId } = parsed.data;

  try {
    const { isNew } = await registerExternalUser({ email, signupSource });

    // El magic link vuelve a PronostiGol tras verificarse (la allowlist de
    // redirects de Auth.js permite este origen externo).
    const callback = new URL(PRONOSTIGOL_BASE_URL);
    if (partidoId) {
      callback.searchParams.set("partidoId", partidoId);
    }

    await signIn("nodemailer", {
      email,
      redirectTo: callback.toString(),
      redirect: false,
    });

    return corsJson({ ok: true, isNew });
  } catch (error) {
    console.error("[external/registro] Error inesperado:", error);
    return corsJson(
      { error: "No se pudo completar el registro. Intenta de nuevo." },
      500,
    );
  }
}
