import Link from "next/link";

import { Container } from "@/components/shared/container";

export function PublicTopbar() {
  return (
    <header className="border-b border-border bg-surface">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="text-sm font-semibold text-foreground">
          Centro Builder HeredIA
        </Link>
        <nav className="flex items-center gap-4 text-sm text-neutral-600">
          <Link href="/login">Login</Link>
          <Link
            href="/registro"
            className="rounded-md bg-accent px-3 py-2 font-medium text-accent-foreground"
          >
            Registro
          </Link>
        </nav>
      </Container>
    </header>
  );
}
