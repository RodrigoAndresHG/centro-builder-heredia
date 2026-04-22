import type { ReactNode } from "react";

import { SidebarPlaceholder } from "@/components/shared/sidebar-placeholder";
import { TopbarPlaceholder } from "@/components/shared/topbar-placeholder";

type AppShellProps = {
  children: ReactNode;
};

const appItems = ["Inicio", "Programas", "Updates", "Perfil", "Soporte"];

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-dvh bg-background">
      <SidebarPlaceholder title="Portal usuario" items={appItems} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopbarPlaceholder label="Area privada" />
        <main className="flex-1 px-5 py-8 sm:px-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
