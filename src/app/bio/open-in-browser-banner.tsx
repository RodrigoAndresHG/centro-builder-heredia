"use client";

import { useEffect, useState } from "react";

// Navegadores internos de apps donde los deep links a otras apps fallan.
function isInAppBrowser(ua: string) {
  return /Instagram|FBAN|FBAV|FB_IAB|TikTok|musical_ly|BytedanceWebview|Line\/|Snapchat/i.test(
    ua,
  );
}

type Platform = "android" | "ios" | "other";

function getPlatform(ua: string): Platform {
  if (/Android/i.test(ua)) return "android";
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  return "other";
}

type BannerState = { show: boolean; platform: Platform };

export function OpenInBrowserBanner() {
  const [{ show, platform }, setState] = useState<BannerState>({
    show: false,
    platform: "other",
  });

  useEffect(() => {
    // Detección client-only: navigator.userAgent solo existe tras montar,
    // así que setear el estado aquí es el patrón correcto en este caso.
    const ua = navigator.userAgent || "";
    if (isInAppBrowser(ua)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState({ show: true, platform: getPlatform(ua) });
    }
  }, []);

  if (!show) return null;

  function openInBrowser() {
    const url = window.location.href;
    if (platform === "android") {
      // Fuerza el navegador por defecto en Android.
      const withoutProtocol = url.replace(/^https?:\/\//, "");
      window.location.href = `intent://${withoutProtocol}#Intent;scheme=https;end`;
      return;
    }
    // iOS: intenta abrir Chrome si está instalado. Si no, el usuario usa ⋯.
    window.location.href = `googlechromes://navigate?url=${encodeURIComponent(url)}`;
  }

  return (
    <div className="relative mb-5 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4">
      <button
        type="button"
        onClick={() => setState((s) => ({ ...s, show: false }))}
        aria-label="Cerrar"
        className="absolute right-3 top-3 text-amber-200/60 transition hover:text-amber-100"
      >
        ✕
      </button>
      <p className="pr-6 text-sm font-semibold text-amber-100">
        Para que los links abran tus apps y la compra funcione sin trabas,
        ábrelo en tu navegador.
      </p>

      {platform === "ios" ? (
        <p className="mt-2 text-xs leading-5 text-amber-200/80">
          Toca el menú{" "}
          <span className="font-semibold text-amber-100">⋯</span> (arriba a la
          derecha) y elige{" "}
          <span className="font-semibold text-amber-100">
            “Abrir en el navegador”
          </span>
          .
        </p>
      ) : (
        <button
          type="button"
          onClick={openInBrowser}
          className="mt-3 inline-flex items-center gap-2 rounded-md bg-amber-300 px-4 py-2 text-sm font-semibold text-neutral-950 transition hover:bg-amber-200"
        >
          Abrir en mi navegador →
        </button>
      )}
    </div>
  );
}
