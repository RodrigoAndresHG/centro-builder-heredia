import type { ReactNode } from "react";

import { PublicTopbar } from "@/components/public/public-topbar";
import { Container } from "@/components/shared/container";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-neutral-950">
      <PublicTopbar />
      <main className="flex-1 py-10 sm:py-14">
        <Container>{children}</Container>
      </main>
      <footer className="border-t border-neutral-800 bg-neutral-950 py-6">
        <Container size="wide">
          <p className="text-sm text-neutral-500">
            Centro Builder HeredIA MVP
          </p>
        </Container>
      </footer>
    </div>
  );
}
