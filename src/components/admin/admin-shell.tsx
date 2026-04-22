import type { ReactNode } from "react";

import { SidebarPlaceholder } from "@/components/shared/sidebar-placeholder";
import { TopbarPlaceholder } from "@/components/shared/topbar-placeholder";

type AdminShellProps = {
  children: ReactNode;
};

const adminItems = [
  "Dashboard",
  "Programas",
  "Modulos",
  "Lecciones",
  "Videos",
  "Updates",
  "Usuarios",
  "Accesos",
];

export function AdminShell({ children }: AdminShellProps) {
  return (
    <div className="flex min-h-dvh bg-background">
      <SidebarPlaceholder title="Admin" items={adminItems} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopbarPlaceholder label="Panel administrativo" />
        <main className="flex-1 px-5 py-8 sm:px-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
