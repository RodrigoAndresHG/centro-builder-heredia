import type { AttributionInput } from "@/lib/validators/attribution";

/**
 * Cookie de atribución: la deja /api/attribution al llegar tráfico con UTMs y
 * la lee el evento createUser de NextAuth para estampar la fuente en la cuenta
 * recién creada. Sobrevive al ir y volver del OAuth de Google.
 */
export const ATTRIBUTION_COOKIE = "heredia_attr";
export const ATTRIBUTION_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 días

/** Parsea el JSON de la cookie de forma tolerante (null si está corrupta). */
export function parseAttributionCookie(
  raw: string | undefined,
): Partial<AttributionInput> | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<AttributionInput>;
    return value && typeof value.source === "string" ? value : null;
  } catch {
    return null;
  }
}
