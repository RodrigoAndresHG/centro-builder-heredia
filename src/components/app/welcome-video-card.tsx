"use client";

import Link from "next/link";
import { useRef, useState } from "react";

type WelcomeVideoCardProps = {
  badge: string;
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
  videoSrc: string;
  videoLabel: string;
};

export function WelcomeVideoCard({
  badge,
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  videoSrc,
  videoLabel,
}: WelcomeVideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  async function toggleAudio() {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    const nextMuted = !isMuted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);

    if (!nextMuted) {
      try {
        await video.play();
      } catch {
        video.muted = true;
        setIsMuted(true);
      }
    }
  }

  return (
    <section className="relative overflow-hidden rounded-3xl border border-teal-400/20 bg-[linear-gradient(135deg,rgba(20,184,166,0.14),rgba(10,10,10,0.94)_44%,rgba(23,23,23,0.98))] p-5 shadow-2xl shadow-black/30 sm:p-6 lg:p-8">
      <div className="pointer-events-none absolute -right-16 top-0 h-56 w-56 rounded-full bg-teal-300/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-10 h-28 w-72 rounded-full bg-white/[0.04] blur-3xl" />

      <div className="relative grid gap-7 lg:grid-cols-[0.95fr_0.8fr] lg:items-center">
        <div>
          <p className="inline-flex rounded-full border border-teal-300/20 bg-teal-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-teal-200">
            {badge}
          </p>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight text-white sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-300 sm:text-base">
            {description}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href={primaryHref}
              className="inline-flex justify-center rounded-md bg-teal-300 px-4 py-2.5 text-sm font-semibold text-neutral-950 shadow-lg shadow-teal-950/40 transition hover:-translate-y-0.5 hover:bg-teal-200"
            >
              {primaryLabel}
            </Link>
            <Link
              href={secondaryHref}
              className="inline-flex justify-center rounded-md border border-neutral-700 bg-neutral-950/70 px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-teal-400/40"
            >
              {secondaryLabel}
            </Link>
          </div>
        </div>

        <div className="mx-auto w-full max-w-sm rounded-[2rem] border border-white/10 bg-neutral-950/75 p-3 shadow-2xl shadow-black/40 backdrop-blur">
          <div className="relative aspect-[9/16] overflow-hidden rounded-[1.45rem] border border-neutral-800 bg-[radial-gradient(circle_at_30%_20%,rgba(45,212,191,0.22),transparent_34%),linear-gradient(135deg,#171717,#050505)]">
            <video
              ref={videoRef}
              src={videoSrc}
              autoPlay
              muted={isMuted}
              loop
              playsInline
              preload="metadata"
              className="h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.28),transparent_34%,rgba(0,0,0,0.44))]" />
            <div className="absolute inset-x-4 top-4 flex items-center justify-between gap-3">
              <span className="rounded-full border border-teal-300/20 bg-black/40 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-teal-200 backdrop-blur">
                {videoLabel}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-neutral-300">
                Onboarding
              </span>
            </div>

            <div className="absolute inset-x-4 bottom-4 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
              <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-neutral-200 backdrop-blur">
                Reproducción silenciosa
              </span>
              <button
                type="button"
                onClick={toggleAudio}
                aria-pressed={!isMuted}
                className="rounded-full border border-teal-300/25 bg-teal-300/15 px-3 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-teal-100 shadow-lg shadow-black/20 backdrop-blur transition hover:-translate-y-0.5 hover:border-teal-200/50 hover:bg-teal-300/20"
              >
                {isMuted ? "Activar audio" : "Silenciar"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
