import { WorkspaceCard, WorkspaceHero } from "@/components/app/workspace-card";
import { auth } from "@/lib/auth";

export default async function PerfilPage() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="space-y-8">
      <WorkspaceHero
        eyebrow="Perfil"
        title="Tu identidad dentro del workspace."
        description="Datos mínimos de cuenta usados para sesión, acceso y continuidad dentro del producto."
      />
      <div className="grid gap-4 md:grid-cols-2">
        <WorkspaceCard>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Nombre
          </p>
          <p className="mt-2 text-sm font-semibold text-white">
            {user?.name ?? "Sin nombre registrado"}
          </p>
        </WorkspaceCard>
        <WorkspaceCard>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Correo
          </p>
          <p className="mt-2 text-sm font-semibold text-white">
            {user?.email ?? "Sin correo"}
          </p>
        </WorkspaceCard>
      </div>
    </div>
  );
}
