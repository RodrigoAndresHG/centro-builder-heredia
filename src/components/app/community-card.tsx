import { getCommunityUrl } from "@/lib/community";

type CommunityCardProps = {
  variant?: "full" | "compact";
};

export function CommunityCard({ variant = "full" }: CommunityCardProps) {
  const url = getCommunityUrl();

  if (variant === "compact") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-between gap-3 rounded-2xl border border-emerald-400/25 bg-emerald-400/10 p-4 transition hover:-translate-y-0.5 hover:border-emerald-400/50"
      >
        <div>
          <p className="text-sm font-semibold text-emerald-100">
            Comunidad de WhatsApp
          </p>
          <p className="mt-1 text-xs leading-5 text-emerald-200/70">
            Únete al grupo de builders y mantente al día.
          </p>
        </div>
        <span className="shrink-0 rounded-md bg-emerald-400 px-3 py-2 text-xs font-semibold text-neutral-950">
          Unirme
        </span>
      </a>
    );
  }

  return (
    <div className="rounded-2xl border border-emerald-400/25 bg-emerald-400/10 p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300">
        Comunidad Builder
      </p>
      <h2 className="mt-3 text-2xl font-semibold leading-tight text-white">
        Únete a la comunidad de WhatsApp
      </h2>
      <p className="mt-3 text-sm leading-7 text-emerald-100/80">
        Conecta con otros builders, comparte lo que construyes, resuelve dudas
        en comunidad y entérate primero de cada nuevo módulo, programa y Live.
      </p>
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="mt-5 inline-flex items-center gap-2 rounded-md bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-neutral-950 transition hover:-translate-y-0.5 hover:bg-emerald-300"
      >
        <span aria-hidden="true">💬</span>
        Unirme a la comunidad
      </a>
    </div>
  );
}
