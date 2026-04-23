import { WorkspaceCard, WorkspaceHero } from "@/components/app/workspace-card";

export default function UserUpdatesPage() {
  return (
    <div className="space-y-8">
      <WorkspaceHero
        eyebrow="Updates"
        title="Novedades del build dentro del mismo workspace."
        description="Esta área queda preparada para publicar cambios, notas y mejoras del producto activo sin sacar al usuario de la experiencia privada."
      />
      <WorkspaceCard>
        <p className="text-sm leading-7 text-neutral-400">
          Todavía no hay updates publicados para tu cuenta.
        </p>
      </WorkspaceCard>
    </div>
  );
}
