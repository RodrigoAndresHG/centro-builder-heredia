"use client";

import { useEffect } from "react";

import { ATTRIBUTION_COOKIE } from "@/lib/attribution";

// Al aterrizar en /registro, persiste la atribución (UTMs + intent) en una
// cookie first-party. SameSite=Lax para que sobreviva el redirect de Google
// y el clic del magic link (ambos son navegaciones GET de nivel superior).
// Auth.js la lee en el evento createUser. Solo escribe si viene utm_source,
// para no pisar una atribución previa con vacío.
export function AttributionCapture() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const source = params.get("utm_source");

    if (!source) {
      return;
    }

    const payload = {
      source,
      medium: params.get("utm_medium") ?? "",
      campaign: params.get("utm_campaign") ?? "",
      intent: params.get("intent") ?? "",
      ts: Date.now(),
    };

    // max-age 1h: margen para que la persistencia final (en /app tras el
    // login) alcance a leerla aunque el flujo de OAuth tome su tiempo.
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${ATTRIBUTION_COOKIE}=${encodeURIComponent(
      JSON.stringify(payload),
    )}; path=/; max-age=3600; SameSite=Lax${secure}`;
  }, []);

  return null;
}
