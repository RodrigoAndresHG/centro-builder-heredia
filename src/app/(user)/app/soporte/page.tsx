import Link from "next/link";

import {
  WorkspaceCard,
  WorkspaceHero,
  WorkspaceTrail,
} from "@/components/app/workspace-card";
import { auth } from "@/lib/auth";

export default async function SoportePage() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="space-y-8">
      <WorkspaceTrail
        items={[{ label: "Workspace", href: "/app" }, { label: "Soporte" }]}
      />

      <WorkspaceHero
        eyebrow="Soporte"
        title="Punto de control para acceso, compra y continuidad."
        description="Usa esta vista si algo no se refleja como esperas: acceso, compra, progreso o contenido disponible."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <WorkspaceCard>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Cuenta
          </p>
          <p className="mt-2 text-sm font-medium text-white">
            {user?.email ?? "Sin correo detectado"}
          </p>
          <p className="mt-3 text-sm leading-7 text-neutral-400">
            Incluye este correo cuando reportes un problema de acceso.
          </p>
        </WorkspaceCard>
        <WorkspaceCard>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Acceso
          </p>
          <p className="mt-2 text-sm leading-7 text-neutral-400">
            Si compraste y el programa no aparece, espera la confirmación de
            Stripe o pide revisión manual al admin.
          </p>
        </WorkspaceCard>
        <WorkspaceCard>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Continuidad
          </p>
          <p className="mt-2 text-sm leading-7 text-neutral-400">
            El progreso se guarda al completar lecciones. Vuelve al dashboard
            para retomar la siguiente lección sugerida.
          </p>
        </WorkspaceCard>
      </div>

      <Link
        href="/app"
        className="inline-flex rounded-md bg-teal-400 px-4 py-2 text-sm font-semibold text-neutral-950 transition hover:bg-teal-300"
      >
        Volver al dashboard
      </Link>
    </div>
  );
}
