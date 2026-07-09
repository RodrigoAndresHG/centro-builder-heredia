import Link from "next/link";

import { Container } from "@/components/shared/container";

// Topbar minimalista para las páginas de acceso (login/registro/confirmación).
// Sin CTAs que compitan con el registro: solo la marca. Alineada al tema
// elevado (near-black + acento sky) para no chocar con el AuthPanel.
export function PublicTopbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#080b12]/85 backdrop-blur-xl">
      <Container size="wide" className="flex h-16 items-center">
        <Link
          href="/"
          className="group flex items-center gap-2.5 text-sm font-semibold text-white"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 text-xs font-bold text-white">
            B
          </span>
          <span className="transition group-hover:text-sky-200">
            Builder HeredIA
          </span>
          <span className="hidden font-mono text-[0.65rem] uppercase tracking-[0.2em] text-neutral-500 sm:inline">
            LMS oficial
          </span>
        </Link>
      </Container>
    </header>
  );
}
