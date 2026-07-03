"use client";

import { useEffect } from "react";

/**
 * Al montar en una página de llegada (p. ej. /registro), si la URL trae
 * `utm_source` envía los UTMs a /api/attribution una sola vez. Eso registra el
 * click y deja la cookie de atribución para asociar la fuente a la cuenta si el
 * visitante completa el registro. No renderiza nada.
 */
export function CaptureAttribution() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const source = params.get("utm_source");
    if (!source) return;

    // Evita reenviar en la misma navegación (StrictMode, re-render, F5 con la
    // misma query).
    const guardKey = `heredia_attr_sent:${window.location.search}`;
    if (sessionStorage.getItem(guardKey)) return;
    sessionStorage.setItem(guardKey, "1");

    void fetch("/api/attribution", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        source,
        medium: params.get("utm_medium"),
        campaign: params.get("utm_campaign"),
        content: params.get("utm_content"),
        intent: params.get("intent"),
        path: window.location.pathname,
      }),
    }).catch(() => {
      // Si falla, permite reintentar en la próxima carga.
      sessionStorage.removeItem(guardKey);
    });
  }, []);

  return null;
}
