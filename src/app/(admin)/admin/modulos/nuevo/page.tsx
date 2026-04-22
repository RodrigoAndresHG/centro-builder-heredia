import Link from "next/link";

import { ModuleForm } from "@/components/admin/content/content-forms";
import { Card } from "@/components/shared/card";
import { PageHeader } from "@/components/shared/page-header";
import { createModule } from "@/lib/actions/admin-content";
import { listProgramOptions } from "@/lib/services";

export default async function NewModulePage() {
  const programs = await listProgramOptions();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin"
        title="Nuevo modulo"
        description="Crea un bloque de aprendizaje asociado a un programa."
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
          action={createModule}
          programs={programs}
          submitLabel="Crear modulo"
        />
      </Card>
    </div>
  );
}
