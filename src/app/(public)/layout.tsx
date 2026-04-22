import type { ReactNode } from "react";

import { PublicTopbar } from "@/components/public/public-topbar";
import { Container } from "@/components/shared/container";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <PublicTopbar />
      <main className="flex-1 py-10 sm:py-14">
        <Container>{children}</Container>
      </main>
      <footer className="border-t border-border bg-surface py-6">
        <Container>
          <p className="text-sm text-neutral-500">
            Centro Builder HeredIA MVP
          </p>
        </Container>
      </footer>
    </div>
  );
}
