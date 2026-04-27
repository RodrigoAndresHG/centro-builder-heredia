import Link from "next/link";
import type { ReactNode } from "react";

import { AppNavigation } from "@/components/app/app-navigation";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-dvh bg-neutral-950 text-white">
      <aside className="hidden min-h-dvh w-72 border-r border-neutral-800 bg-neutral-950 px-5 py-6 lg:block">
        <Link href="/app" className="block">
          <p className="text-sm font-semibold text-white">Builder HeredIA</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-teal-300">
            Private LMS
          </p>
        </Link>

        <AppNavigation variant="sidebar" />

        <div className="mt-8 rounded-2xl border border-teal-400/20 bg-teal-400/10 p-4 shadow-xl shadow-black/20">
          <p className="text-xs font-semibold uppercase text-teal-300">
            Producto activo
          </p>
          <p className="mt-2 text-sm font-semibold leading-6 text-white">
            Build IdeaCash — Founder Access
          </p>
          <p className="mt-2 text-xs leading-5 text-neutral-400">
            Programas, lecciones, progreso y soporte dentro del mismo entorno.
          </p>
        </div>

        <div className="mt-4 rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Modo
          </p>
          <p className="mt-2 text-sm font-semibold text-white">
            Construcción guiada
          </p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="sticky top-0 z-10 border-b border-neutral-800 bg-neutral-950/90 px-5 py-4 backdrop-blur sm:px-8 lg:px-10">
          <div className="flex items-center justify-between gap-4">
            <Link href="/app" className="text-sm font-semibold text-white lg:hidden">
              HeredIA Workspace
            </Link>
            <span className="hidden text-sm font-semibold text-white lg:inline">
              Workspace privado
            </span>
            <span className="rounded-md border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
              Plataforma activa
            </span>
          </div>
          <AppNavigation variant="mobile" />
        </div>
        <main className="flex-1 bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.08),transparent_34rem)] px-5 py-8 sm:px-8 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}
