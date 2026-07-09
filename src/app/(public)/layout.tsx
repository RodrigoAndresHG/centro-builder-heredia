import type { ReactNode } from "react";

import { PublicTopbar } from "@/components/public/public-topbar";
import { Container } from "@/components/shared/container";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-[#080b12]">
      <PublicTopbar />
      <main className="flex-1 py-10 sm:py-14">
        <Container>{children}</Container>
      </main>
      <footer className="border-t border-white/10 bg-[#080b12] py-6">
        <Container size="wide">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-neutral-500">
            Builder HeredIA · by Rodrigo HeredIA
          </p>
        </Container>
      </footer>
    </div>
  );
}
