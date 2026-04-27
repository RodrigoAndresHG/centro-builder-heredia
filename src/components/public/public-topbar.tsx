import Link from "next/link";

import { Container } from "@/components/shared/container";

export function PublicTopbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-neutral-800 bg-neutral-950/86 backdrop-blur-xl">
      <Container size="wide" className="flex h-16 items-center justify-between">
        <Link href="/" className="group text-sm font-semibold text-white">
          <span className="transition group-hover:text-teal-200">
            Builder HeredIA
          </span>
          <span className="ml-2 hidden text-xs font-medium text-neutral-500 sm:inline">
            LMS
          </span>
        </Link>
        <nav className="flex items-center gap-3 text-sm text-neutral-300">
          <Link
            href="/registro?intent=explore"
            className="transition hover:text-white"
          >
            Explorar
          </Link>
          <Link
            href="/registro?intent=buy"
            className="rounded-md bg-teal-300 px-3 py-2 font-semibold text-neutral-950 shadow-lg shadow-teal-950/30 transition duration-300 hover:-translate-y-0.5 hover:bg-teal-200"
          >
            Comprar acceso
          </Link>
        </nav>
      </Container>
    </header>
  );
}
