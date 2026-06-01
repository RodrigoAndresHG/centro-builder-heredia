import Link from "next/link";
import { notFound } from "next/navigation";

import {
  LessonForm,
  LessonPromptsManager,
  LessonResourcesManager,
  LessonVideoManualAssociate,
} from "@/components/admin/content/content-forms";
import { DeleteEntityDangerZone } from "@/components/admin/content/danger-zone";
import { Card } from "@/components/shared/card";
import { PageHeader } from "@/components/shared/page-header";
import {
  associateLessonVideo,
  clearLessonVideo,
  createLessonPrompt,
  createLessonResource,
  deleteLesson,
  deleteLessonPrompt,
  deleteLessonResource,
  updateLesson,
  updateLessonPrompt,
  updateLessonResource,
} from "@/lib/actions/admin-content";
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
        description={`${lesson.title} · configura contenido, publicación y video desde esta lección.`}
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

      <Card>
        <LessonVideoManualAssociate
          lessonId={lesson.id}
          streamVideoId={lesson.streamVideoId}
          videoStatus={lesson.videoStatus}
          videoDuration={lesson.videoDuration}
          associateAction={associateLessonVideo}
          clearAction={clearLessonVideo}
        />
      </Card>

      <Card>
        <LessonPromptsManager
          lessonId={lesson.id}
          prompts={lesson.prompts}
          createAction={createLessonPrompt}
          updateAction={updateLessonPrompt}
          deleteAction={deleteLessonPrompt}
        />
      </Card>

      <Card>
        <LessonResourcesManager
          lessonId={lesson.id}
          resources={lesson.resources}
          createAction={createLessonResource}
          updateAction={updateLessonResource}
          deleteAction={deleteLessonResource}
        />
      </Card>

      <DeleteEntityDangerZone
        action={deleteLesson.bind(null, lesson.id)}
        title="Zona de peligro"
        description="Eliminar esta lección borra su contenido, prompts, recursos y el progreso registrado de los usuarios en ella. Esta acción no se puede deshacer."
        confirmMessage={`¿Eliminar la lección "${lesson.title}"? Se borrarán sus prompts, recursos y el progreso de usuarios.`}
        buttonLabel="Eliminar lección"
      />
    </div>
  );
}
