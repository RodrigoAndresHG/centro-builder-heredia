import Link from "next/link";

import { Card } from "@/components/shared/card";
import { PageHeader } from "@/components/shared/page-header";
import { auth } from "@/lib/auth";

export default async function SoportePage() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Usuario"
        title="Soporte"
        description="Usa esta vista como punto de control si tu acceso, compra o progreso no se refleja como esperas."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Cuenta
          </p>
          <p className="mt-2 text-sm font-medium text-foreground">
            {user?.email ?? "Sin correo detectado"}
          </p>
          <p className="mt-3 text-sm leading-6 text-neutral-600">
            Incluye este correo cuando reportes un problema de acceso.
          </p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Acceso
          </p>
          <p className="mt-2 text-sm leading-6 text-neutral-600">
            Si compraste y el programa no aparece, espera la confirmacion de
            Stripe o pide revision manual al admin.
          </p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Continuidad
          </p>
          <p className="mt-2 text-sm leading-6 text-neutral-600">
            El progreso se guarda al completar lecciones. Vuelve al dashboard
            para retomar la siguiente leccion sugerida.
          </p>
        </Card>
      </div>

      <Link
        href="/app"
        className="inline-flex rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
      >
        Volver al dashboard
      </Link>
    </div>
  );
}
