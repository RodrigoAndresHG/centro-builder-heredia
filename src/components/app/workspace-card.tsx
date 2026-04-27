import Link from "next/link";
import type { ReactNode } from "react";

type WorkspaceCardProps = {
  children: ReactNode;
  className?: string;
};

export function WorkspaceCard({ children, className = "" }: WorkspaceCardProps) {
  return (
    <div
      className={`rounded-2xl border border-neutral-800/90 bg-neutral-900/88 p-6 shadow-2xl shadow-black/20 backdrop-blur transition duration-300 hover:border-neutral-700 ${className}`}
    >
      {children}
    </div>
  );
}

export function WorkspaceHero({
  eyebrow,
  title,
  description,
  action,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl shadow-black/30 lg:p-8">
      <div className="pointer-events-none absolute inset-x-8 top-0 h-28 rounded-full bg-teal-300/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-36 w-36 rounded-full bg-white/[0.03] blur-2xl" />
      <div className="relative">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            {eyebrow ? (
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-300">
                {eyebrow}
              </p>
            ) : null}
            <h1 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-4xl">
              {title}
            </h1>
            {description ? (
              <p className="mt-4 max-w-2xl text-base leading-8 text-neutral-300">
                {description}
              </p>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
        {children ? <div className="mt-7">{children}</div> : null}
      </div>
    </section>
  );
}

export function WorkspaceSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">{title}</h2>
          {description ? (
            <p className="mt-2 max-w-2xl text-sm leading-7 text-neutral-400">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {children}
    </section>
  );
}

export function WorkspaceMetric({
  label,
  value,
  detail,
}: {
  label: string;
  value: string | number;
  detail?: string;
}) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
      {detail ? (
        <p className="mt-2 text-sm leading-6 text-neutral-500">{detail}</p>
      ) : null}
    </div>
  );
}

type WorkspaceTrailItem = {
  label: string;
  href?: string;
};

export function WorkspaceTrail({ items }: { items: WorkspaceTrailItem[] }) {
  return (
    <nav
      aria-label="Contexto de navegacion"
      className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500"
    >
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="flex items-center gap-2">
          {item.href ? (
            <Link href={item.href} className="transition hover:text-teal-200">
              {item.label}
            </Link>
          ) : (
            <span className="text-teal-300">{item.label}</span>
          )}
          {index < items.length - 1 ? <span>/</span> : null}
        </span>
      ))}
    </nav>
  );
}
