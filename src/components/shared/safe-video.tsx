"use client";

import { useEffect, useState } from "react";

import { isTikTokInAppBrowser } from "@/lib/in-app-browser";

type SafeVideoProps = {
  src: string;
  poster: string;
  className?: string;
  preload?: "none" | "metadata" | "auto";
};

// Video de fondo "seguro": por defecto renderiza el póster (imagen estática) y
// solo sube al video autoplay en navegadores que lo manejan bien. Evita el
// congelamiento del WebView de TikTok (y respeta prefers-reduced-motion y el
// ahorro de datos). SSR siempre entrega el póster, así que TikTok nunca recibe
// un elemento <video> que colapse la página.
export function SafeVideo({
  src,
  poster,
  className,
  preload = "metadata",
}: SafeVideoProps) {
  const [playable, setPlayable] = useState(false);

  useEffect(() => {
    const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
    const saveData =
      typeof navigator !== "undefined" &&
      (navigator as Navigator & { connection?: { saveData?: boolean } })
        .connection?.saveData === true;

    if (!isTikTokInAppBrowser(ua) && !reduceMotion && !saveData) {
      // Detección client-only (UA/matchMedia): actualizar estado en el mount
      // es el patrón correcto — en SSR no conocemos el navegador.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPlayable(true);
    }
  }, []);

  if (!playable) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={poster} alt="" aria-hidden className={className} />;
  }

  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      preload={preload}
      poster={poster}
      aria-hidden
      className={className}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
