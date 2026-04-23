import Link from "next/link";

import { Container } from "@/components/shared/container";

export function PublicTopbar() {
  return (
    <header className="border-b border-neutral-800 bg-neutral-950">
      <Container size="wide" className="flex h-16 items-center justify-between">
        <Link href="/" className="text-sm font-semibold text-white">
          Centro Builder HeredIA
        </Link>
        <nav className="flex items-center gap-3 text-sm text-neutral-300">
          <Link href="/login" className="transition hover:text-white">
            Iniciar sesión
          </Link>
          <Link
            href="/registro"
            className="rounded-md bg-teal-400 px-3 py-2 font-semibold text-neutral-950 transition hover:bg-teal-300"
          >
            Comprar acceso
          </Link>
        </nav>
      </Container>
    </header>
  );
}
