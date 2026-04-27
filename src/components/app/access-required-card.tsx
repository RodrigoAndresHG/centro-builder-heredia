import Link from "next/link";

import { CheckoutButton } from "@/components/app/checkout-button";
import { WorkspaceCard } from "@/components/app/workspace-card";

type AccessRequiredCardProps = {
  title?: string;
  description?: string | null;
  productSlug?: string | null;
  compact?: boolean;
};

export function AccessRequiredCard({
  title = "Acceso requerido",
  description = "Este contenido pertenece a un producto premium. Tu cuenta esta activa, pero aun no tiene permiso para abrir este programa.",
  productSlug,
  compact = false,
}: AccessRequiredCardProps) {
  return (
    <WorkspaceCard className={compact ? "" : "max-w-4xl border-teal-400/20 bg-teal-400/10"}>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-300">
        Acceso premium pendiente
      </p>
      <h2 className="mt-3 text-2xl font-semibold text-white">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-neutral-300">
        {description}
      </p>
      <div className="mt-5 grid gap-3 rounded-xl border border-neutral-800 bg-neutral-950 p-4 text-sm font-medium text-neutral-300 sm:grid-cols-3">
        <span>Programa privado</span>
        <span>Lecciones guiadas</span>
        <span>Progreso y soporte</span>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        {productSlug ? <CheckoutButton productSlug={productSlug} /> : null}
        <Link
          href="/app"
          className="rounded-md border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:border-neutral-500"
        >
          Volver al dashboard
        </Link>
      </div>
      <p className="mt-4 text-xs leading-5 text-neutral-500">
        ¿Ya pagaste y no ves tu acceso?{" "}
        <Link
          href="/app/soporte"
          className="font-semibold text-neutral-300 underline decoration-neutral-700 underline-offset-4 transition hover:text-white"
        >
          Revisa soporte.
        </Link>
      </p>
    </WorkspaceCard>
  );
}
