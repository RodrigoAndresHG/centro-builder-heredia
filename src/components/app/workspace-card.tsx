import type { ReactNode } from "react";

type WorkspaceCardProps = {
  children: ReactNode;
  className?: string;
};

export function WorkspaceCard({ children, className = "" }: WorkspaceCardProps) {
  return (
    <div
      className={`rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-xl shadow-black/20 ${className}`}
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
    <section className="rounded-3xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl shadow-black/20 lg:p-8">
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
      <div>
        <h2 className="text-2xl font-semibold text-white">{title}</h2>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-7 text-neutral-400">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
