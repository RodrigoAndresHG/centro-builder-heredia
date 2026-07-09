"use client";

import Link from "next/link";
import { type MouseEvent, useRef } from "react";

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  function onMouseMove(event: MouseEvent<HTMLElement>) {
    const hero = heroRef.current;
    if (!hero) return;
    // Respeta prefers-reduced-motion: no seguimos el cursor.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = hero.getBoundingClientRect();
    hero.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    hero.style.setProperty("--my", `${event.clientY - rect.top}px`);
  }

  return (
    <section className="hero" id="top" ref={heroRef} onMouseMove={onMouseMove}>
      <div className="hero-video">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/videos/keyboard.jpg"
          aria-hidden="true"
        >
          <source src="/videos/keyboard.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="hero__grid" aria-hidden="true" />
      <div className="hero__spot" aria-hidden="true" />

      <div className="wrap hero__row">
        <div className="hero__inner">
          <span className="eyebrow">Builder HeredIA · LMS oficial</span>
          <h1>
            Aprende a construir <b>apps Multi-IA reales</b>, paso a paso.
          </h1>
          <p className="hero__sub">
            El LMS oficial de Rodrigo HeredIA. Conectas{" "}
            <b>OpenAI, Anthropic y Gemini</b> y te llevas el agente funcionando —
            no solo teoría.
          </p>
          <div className="hero__cta">
            <Link href="/registro?intent=buy" className="btn btn--primary">
              Obtener el programa · USD 9.99 <span className="arw">→</span>
            </Link>
            <Link href="/registro?intent=explore" className="btn btn--ghost">
              Empezar gratis
            </Link>
          </div>
          <div className="hero__meta">
            <span>
              <b>Construido en vivo</b> · TikTok
            </span>
            <span>
              <b>Multi-IA</b> · OpenAI · Anthropic · Gemini
            </span>
            <span>
              <b>Acceso inmediato</b> · pago único
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
