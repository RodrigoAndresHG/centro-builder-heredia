"use client";

import { useRef, useState } from "react";

import { Reveal } from "@/components/public/reveal";

export function VideoShowcase() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  function toggleAudio() {
    const video = videoRef.current;
    const nextMuted = !isMuted;

    setIsMuted(nextMuted);

    if (video) {
      video.muted = nextMuted;
      video.volume = nextMuted ? 0 : 0.85;

      if (!nextMuted) {
        void video.play().catch(() => {
          video.muted = true;
          setIsMuted(true);
        });
      }
    }
  }

  return (
    <Reveal delay={140}>
      <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 p-4 shadow-2xl shadow-black/40 transition duration-500 hover:-translate-y-1 hover:border-teal-400/30">
        <div className="absolute inset-x-8 top-6 h-24 rounded-full bg-teal-300/10 blur-3xl" />

        <div className="relative grid gap-5 lg:grid-cols-[0.78fr_1fr] lg:items-center">
          <div className="order-2 rounded-xl border border-neutral-800 bg-neutral-950 p-4 lg:order-1">
            <p className="text-xs font-semibold uppercase text-teal-300">
              Preview real del LMS
            </p>
            <h3 className="mt-3 text-2xl font-semibold leading-tight text-white">
              Preview real del entorno Builder.
            </h3>
            <p className="mt-3 text-sm leading-7 text-neutral-400">
              Video vertical de prueba para sentir el producto antes del
              lanzamiento.
            </p>
            <div className="mt-5 grid gap-2 text-xs font-semibold uppercase text-neutral-500">
              <span className="rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2">
                Inicia en silencio
              </span>
              <span className="rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2">
                Audio opcional
              </span>
            </div>
          </div>

          <div className="order-1 mx-auto w-full max-w-[22rem] lg:order-2">
            <div className="rounded-[2rem] border border-neutral-700 bg-neutral-950 p-2 shadow-2xl shadow-teal-950/20">
              <div className="relative aspect-[9/16] overflow-hidden rounded-[1.55rem] border border-neutral-800 bg-black">
                <video
                  ref={videoRef}
                  src="/video/builder-preview.mp4"
                  className="h-full w-full object-cover"
                  autoPlay
                  muted={isMuted}
                  loop
                  playsInline
                  preload="metadata"
                  aria-label="Vista previa vertical de Builder HeredIA"
                />
                <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent p-4">
                  <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase text-white backdrop-blur">
                    {isMuted ? "Silent preview" : "Audio on"}
                  </span>
                  <span className="h-2 w-2 rounded-full bg-teal-300 shadow-lg shadow-teal-300/50" />
                </div>
                <button
                  type="button"
                  onClick={toggleAudio}
                  aria-pressed={!isMuted}
                  className="absolute right-4 top-12 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/45 px-3 py-2 text-[11px] font-semibold uppercase text-white shadow-xl shadow-black/30 backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-teal-300/60 hover:bg-black/65 focus:outline-none focus:ring-2 focus:ring-teal-300/70"
                >
                  <span
                    aria-hidden="true"
                    className="flex h-4 w-4 items-center justify-center rounded-full border border-white/20 text-[9px]"
                  >
                    {isMuted ? "♪" : "×"}
                  </span>
                  {isMuted ? "Activar audio" : "Silenciar"}
                </button>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-4">
                  <p className="text-sm font-semibold text-white">
                    IdeaCash HeredIA
                  </p>
                  <p className="mt-1 text-xs text-neutral-300">
                    Primer programa del LMS oficial
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
