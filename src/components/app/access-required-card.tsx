import Link from "next/link";

import { Card } from "@/components/shared/card";

type AccessRequiredCardProps = {
  title?: string;
  description?: string | null;
  compact?: boolean;
};

export function AccessRequiredCard({
  title = "Acceso requerido",
  description = "Este contenido pertenece a un producto premium. Tu cuenta esta activa, pero aun no tiene permiso para abrir este programa.",
  compact = false,
}: AccessRequiredCardProps) {
  return (
    <Card className={compact ? "" : "max-w-3xl"}>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
        Contenido premium
      </p>
      <h2 className="mt-2 text-xl font-semibold text-foreground">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-neutral-600">{description}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href="/app"
          className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
        >
          Volver al dashboard
        </Link>
        <Link
          href="/app/soporte"
          className="rounded-md border border-border bg-surface px-4 py-2 text-sm font-semibold text-foreground"
        >
          Solicitar acceso
        </Link>
      </div>
    </Card>
  );
}
