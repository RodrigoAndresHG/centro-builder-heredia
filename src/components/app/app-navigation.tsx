"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const appItems = [
  { label: "Inicio", href: "/app" },
  { label: "Programas", href: "/app/programas" },
  { label: "Updates", href: "/app/updates" },
  { label: "Perfil", href: "/app/perfil" },
  { label: "Soporte", href: "/app/soporte" },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/app") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppNavigation({ variant }: { variant: "sidebar" | "mobile" }) {
  const pathname = usePathname();

  if (variant === "mobile") {
    return (
      <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
        {appItems.map((item) => {
          const isActive = isActivePath(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`shrink-0 rounded-md border px-3 py-2 text-xs font-semibold transition ${
                isActive
                  ? "border-teal-400/40 bg-teal-400/10 text-teal-100"
                  : "border-neutral-800 bg-neutral-900 text-neutral-300"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="mt-8 space-y-1" aria-label="Area privada">
      {appItems.map((item) => {
        const isActive = isActivePath(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`group relative block rounded-lg border px-3 py-2.5 text-sm font-semibold transition ${
              isActive
                ? "border-teal-400/30 bg-teal-400/10 text-white shadow-lg shadow-black/20"
                : "border-transparent text-neutral-300 hover:border-teal-400/20 hover:bg-neutral-900 hover:text-white"
            }`}
          >
            <span
              className={`absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full transition ${
                isActive ? "bg-teal-300" : "bg-transparent"
              }`}
            />
            <span className="pl-2">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
