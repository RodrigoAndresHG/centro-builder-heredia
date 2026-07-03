"use client";

import { useEffect, useRef } from "react";

import { persistAttribution } from "@/lib/actions/attribution";
import { ATTRIBUTION_COOKIE } from "@/lib/attribution";

// Tras cargar /app (ya autenticado), dispara una sola vez la persistencia de
// la atribución capturada en /registro. Fire-and-forget: no bloquea la UI.
// Solo llama al servidor si de verdad hay cookie que procesar (evita un POST
// en cada carga de /app cuando no hay nada que capturar).
export function AttributionSync() {
  const done = useRef(false);

  useEffect(() => {
    if (done.current) {
      return;
    }
    done.current = true;

    if (!document.cookie.includes(`${ATTRIBUTION_COOKIE}=`)) {
      return;
    }

    void persistAttribution();
  }, []);

  return null;
}
