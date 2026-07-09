"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const navLinks = [
  { href: "#incluye", label: "Qué incluye" },
  { href: "#programas", label: "Programas" },
  { href: "#metodo", label: "Cómo aprendes" },
];

export function LandingHeader() {
  const [stuck, setStuck] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      setStuck(window.scrollY > 20);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? (window.scrollY / h) * 100 : 0);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Bloquea el scroll del body mientras el menú móvil está abierto.
  useEffect(() => {
    document.body.style.overflow = sheetOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sheetOpen]);

  return (
    <>
      <div className="prog" style={{ width: `${progress}%` }} aria-hidden="true" />

      <header className={stuck ? "stuck" : undefined}>
        <div className="wrap nav">
          <Link href="/" className="logo">
            <span className="mark">B</span> Builder HeredIA
          </Link>
          <nav className="nav__links">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <Link href="/registro?intent=explore" className="nav__cta">
            Empezar gratis
          </Link>
          <button
            type="button"
            className="burger"
            onClick={() => setSheetOpen(true)}
            aria-label="Abrir menú"
          >
            ☰
          </button>
        </div>
      </header>

      <div className={`sheet${sheetOpen ? " open" : ""}`}>
        <button
          type="button"
          className="sheet__close"
          onClick={() => setSheetOpen(false)}
          aria-label="Cerrar menú"
        >
          ✕
        </button>
        {navLinks.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setSheetOpen(false)}>
            {link.label}
          </a>
        ))}
        <a href="/registro?intent=explore" onClick={() => setSheetOpen(false)}>
          Empezar gratis
        </a>
      </div>
    </>
  );
}
