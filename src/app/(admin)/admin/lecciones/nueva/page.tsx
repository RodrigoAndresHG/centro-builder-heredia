import Link from "next/link";

import { LessonForm } from "@/components/admin/content/content-forms";
import { Card } from "@/components/shared/card";
import { PageHeader } from "@/components/shared/page-header";
import { createLesson } from "@/lib/actions/admin-content";
import { listModuleOptions, listProgramOptions } from "@/lib/services";

export default async function NewLessonPage() {
  const [programs, modules] = await Promise.all([
    listProgramOptions(),
    listModuleOptions(),
  ]);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin"
        title="Nueva leccion"
        description="Crea una pieza de contenido dentro de un módulo. Si ya tienes video, configúralo aquí mismo; no necesitas pasar por la biblioteca de videos."
        action={
          <Link
            href="/admin/lecciones"
            className="rounded-md border border-border px-4 py-2 text-sm font-semibold text-foreground"
          >
            Volver
          </Link>
        }
      />
      <Card>
        <LessonForm
          action={createLesson}
          programs={programs}
          modules={modules}
          submitLabel="Crear leccion"
        />
      </Card>
    </div>
  );
}
