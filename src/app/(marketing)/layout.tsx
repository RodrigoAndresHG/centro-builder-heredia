import type { ReactNode } from "react";
import Link from "next/link";

import { BlueprintFrame } from "@/components/marketing/blueprint-frame";
import { LandingHeader } from "@/components/marketing/landing-header";
import { inter, jetbrainsMono } from "../fonts";
import "../elevated.css";

// Layout SOLO de la landing pública. El tema "elevado" (dark) vive scopeado
// bajo .theme-elevated, así que no se filtra al resto de la app.
export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${inter.variable} ${jetbrainsMono.variable} theme-elevated`}>
      <BlueprintFrame />
      <LandingHeader />
      {children}
      <footer>
        <div className="wrap foot">
          <div className="foot__links">
            <Link href="/">Inicio</Link>
            <a href="#programas">Programas</a>
            <a
              href="https://rodriheredia.com/heredia"
              target="_blank"
              rel="noopener"
            >
              Ecosistema HeredIA
            </a>
            <a
              href="https://www.linkedin.com/in/rodrigoheredia"
              target="_blank"
              rel="noopener"
            >
              LinkedIn
            </a>
          </div>
          <div className="foot__copy">
            © Rodrigo HeredIA · builder.rodriheredia.com
          </div>
        </div>
      </footer>
    </div>
  );
}
