import Link from "next/link";

type WelcomeVideoCardProps = {
  badge: string;
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
  videoLabel: string;
  videoTitle: string;
  videoDescription: string;
};

export function WelcomeVideoCard({
  badge,
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  videoLabel,
  videoTitle,
  videoDescription,
}: WelcomeVideoCardProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-teal-400/20 bg-[linear-gradient(135deg,rgba(20,184,166,0.14),rgba(10,10,10,0.94)_44%,rgba(23,23,23,0.98))] p-5 shadow-2xl shadow-black/30 sm:p-6 lg:p-8">
      <div className="pointer-events-none absolute -right-16 top-0 h-56 w-56 rounded-full bg-teal-300/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-10 h-28 w-72 rounded-full bg-white/[0.04] blur-3xl" />

      <div className="relative grid gap-7 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <div>
          <p className="inline-flex rounded-full border border-teal-300/20 bg-teal-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-teal-200">
            {badge}
          </p>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight text-white sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-300 sm:text-base">
            {description}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href={primaryHref}
              className="inline-flex justify-center rounded-md bg-teal-300 px-4 py-2.5 text-sm font-semibold text-neutral-950 shadow-lg shadow-teal-950/40 transition hover:-translate-y-0.5 hover:bg-teal-200"
            >
              {primaryLabel}
            </Link>
            <Link
              href={secondaryHref}
              className="inline-flex justify-center rounded-md border border-neutral-700 bg-neutral-950/70 px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-teal-400/40"
            >
              {secondaryLabel}
            </Link>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-white/10 bg-neutral-950/75 p-3 shadow-2xl shadow-black/40 backdrop-blur">
          <div className="relative aspect-video overflow-hidden rounded-2xl border border-neutral-800 bg-[radial-gradient(circle_at_30%_20%,rgba(45,212,191,0.22),transparent_34%),linear-gradient(135deg,#171717,#050505)]">
            <div className="absolute inset-x-4 top-4 flex items-center justify-between gap-3">
              <span className="rounded-full border border-teal-300/20 bg-black/40 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-teal-200 backdrop-blur">
                {videoLabel}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-neutral-300">
                Onboarding
              </span>
            </div>

            <div className="absolute inset-0 flex items-center justify-center px-6">
              <div className="max-w-md text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-teal-300/30 bg-teal-300/15 text-xs font-semibold uppercase tracking-[0.14em] text-teal-100 shadow-xl shadow-teal-950/30">
                  Play
                </div>
                <p className="mt-5 text-xl font-semibold text-white">
                  {videoTitle}
                </p>
                <p className="mt-3 text-sm leading-6 text-neutral-400">
                  {videoDescription}
                </p>
              </div>
            </div>

            <div className="absolute inset-x-4 bottom-4 grid grid-cols-3 gap-2">
              {["Contexto", "Ruta", "Siguiente"].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-center text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-neutral-400"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
