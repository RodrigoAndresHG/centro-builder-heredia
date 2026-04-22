import Link from "next/link";
import { notFound } from "next/navigation";

import { LessonForm } from "@/components/admin/content/content-forms";
import { Card } from "@/components/shared/card";
import { PageHeader } from "@/components/shared/page-header";
import { updateLesson } from "@/lib/actions/admin-content";
import {
  getAdminLesson,
  listModuleOptions,
  listProgramOptions,
} from "@/lib/services";

type EditLessonPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditLessonPage({ params }: EditLessonPageProps) {
  const { id } = await params;
  const [lesson, programs, modules] = await Promise.all([
    getAdminLesson(id),
    listProgramOptions(),
    listModuleOptions(),
  ]);

  if (!lesson) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin"
        title="Editar leccion"
        description={lesson.title}
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
          action={updateLesson.bind(null, lesson.id)}
          programs={programs}
          modules={modules}
          lesson={lesson}
          submitLabel="Guardar cambios"
        />
      </Card>
    </div>
  );
}
