import Link from "next/link";
import { notFound } from "next/navigation";

import { ModuleForm } from "@/components/admin/content/content-forms";
import { DeleteEntityDangerZone } from "@/components/admin/content/danger-zone";
import { Card } from "@/components/shared/card";
import { PageHeader } from "@/components/shared/page-header";
import { deleteModule, updateModule } from "@/lib/actions/admin-content";
import { getAdminModule, listProgramOptions } from "@/lib/services";

type EditModulePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditModulePage({ params }: EditModulePageProps) {
  const { id } = await params;
  const [module, programs] = await Promise.all([
    getAdminModule(id),
    listProgramOptions(),
  ]);

  if (!module) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin"
        title="Editar modulo"
        description={module.title}
        action={
          <Link
            href="/admin/modulos"
            className="rounded-md border border-border px-4 py-2 text-sm font-semibold text-foreground"
          >
            Volver
          </Link>
        }
      />
      <Card>
        <ModuleForm
          action={updateModule.bind(null, module.id)}
          programs={programs}
          module={module}
          submitLabel="Guardar cambios"
        />
      </Card>

      <DeleteEntityDangerZone
        action={deleteModule.bind(null, module.id)}
        title="Zona de peligro"
        description={`Eliminar este módulo lo quita del programa. Sus ${module._count.lessons} lección(es) NO se borran: quedan sin módulo asignado y puedes reasignarlas editándolas. Esta acción no se puede deshacer.`}
        confirmMessage={`¿Eliminar el módulo "${module.title}"? Sus lecciones quedarán sin módulo asignado.`}
        buttonLabel="Eliminar módulo"
      />
    </div>
  );
}
