// Atribución de marketing: helpers puros compartidos por /bio (construcción
// de links), /registro (captura en cookie) y Auth.js (persistencia al crear
// usuario). Sin dependencias para poder usarse en cliente y servidor.

export const ATTRIBUTION_COOKIE = "bh_attribution";

// Valor por defecto de `src` cuando el visitante llega a /bio sin ?src=...
export const DEFAULT_SRC = "bio";
export const UTM_MEDIUM = "bio";
export const UTM_CAMPAIGN = "empieza";

// Normaliza el `src` a un slug seguro para meter en URLs (evita inyección).
// Si no es válido, cae al valor por defecto "bio".
export function normalizeSrc(raw?: string | null): string {
  if (!raw) {
    return DEFAULT_SRC;
  }

  const cleaned = raw.trim().toLowerCase();
  return /^[a-z0-9_-]{1,20}$/.test(cleaned) ? cleaned : DEFAULT_SRC;
}

export type RegistroIntent = "explore" | "buy";

// Construye el link a /registro con la atribución UTM incrustada.
export function buildRegistroHref(intent: RegistroIntent, src: string): string {
  const params = new URLSearchParams({
    intent,
    utm_source: normalizeSrc(src),
    utm_medium: UTM_MEDIUM,
    utm_campaign: UTM_CAMPAIGN,
  });

  return `/registro?${params.toString()}`;
}

export type Attribution = {
  source: string;
  medium?: string;
  campaign?: string;
  intent?: RegistroIntent;
};

// Parsea (y sanea) el JSON de atribución guardado en la cookie. Devuelve null
// si no hay una fuente válida.
export function parseAttributionCookie(
  raw?: string | null,
): Attribution | null {
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as Record<
      string,
      unknown
    >;

    const clip = (value: unknown) =>
      typeof value === "string" && value.trim().length > 0
        ? value.trim().slice(0, 60)
        : undefined;

    const source = clip(parsed.source);
    if (!source) {
      return null;
    }

    const intent =
      parsed.intent === "buy" || parsed.intent === "explore"
        ? (parsed.intent as RegistroIntent)
        : undefined;

    return {
      source,
      medium: clip(parsed.medium),
      campaign: clip(parsed.campaign),
      intent,
    };
  } catch {
    return null;
  }
}

export type AttributionUpdate = {
  utmSource: string;
  utmMedium: string | null;
  utmCampaign: string | null;
  signupIntent: string | null;
};

// Decide qué escribir en el User a partir de la cookie de atribución.
// Semántica de PRIMER TOQUE: si el usuario ya tiene fuente, NO se reescribe
// (devuelve null). Devuelve null también si la cookie no trae fuente válida.
// Puro y sin dependencias → fácil de testear y de usar en cliente o servidor.
export function computeAttributionUpdate(
  currentUtmSource: string | null | undefined,
  cookieValue: string | null | undefined,
): AttributionUpdate | null {
  if (currentUtmSource) {
    return null;
  }

  const attribution = parseAttributionCookie(cookieValue);
  if (!attribution) {
    return null;
  }

  return {
    utmSource: attribution.source,
    utmMedium: attribution.medium ?? null,
    utmCampaign: attribution.campaign ?? null,
    signupIntent: attribution.intent ?? null,
  };
}
