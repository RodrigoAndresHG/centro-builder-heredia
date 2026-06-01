import Link from "next/link";

import { ProgramFilter } from "@/components/admin/content/program-filter";
import { StatusBadge } from "@/components/admin/content/status-badge";
import { Card } from "@/components/shared/card";
import { PageHeader } from "@/components/shared/page-header";
import { toggleLessonPublished } from "@/lib/actions/admin-content";
import { listAdminLessons, listProgramOptions } from "@/lib/services";

type AdminLeccionesPageProps = {
  searchParams: Promise<{ program?: string }>;
};

type AdminLesson = Awaited<ReturnType<typeof listAdminLessons>>[number];

function LessonRow({ lesson }: { lesson: AdminLesson }) {
  return (
    <tr>
      <td className="px-5 py-4">
        <p className="font-semibold text-foreground">{lesson.title}</p>
        <p className="mt-1 text-sm text-neutral-500">{lesson.slug}</p>
      </td>
      <td className="px-5 py-4 text-sm text-neutral-600">
        {lesson.module?.title ?? "Sin modulo"}
      </td>
      <td className="px-5 py-4">
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            lesson.streamVideoId || lesson.videoUrl
              ? "bg-emerald-50 text-emerald-700"
              : "bg-neutral-100 text-neutral-600"
          }`}
        >
          {lesson.streamVideoId || lesson.videoUrl ? "Con video" : "Sin video"}
        </span>
        {lesson.streamVideoId ? (
          <p className="mt-1 text-xs text-neutral-500">
            Stream · {lesson.videoStatus}
          </p>
        ) : lesson.videoProvider ? (
          <p className="mt-1 text-xs text-neutral-500">{lesson.videoProvider}</p>
        ) : null}
      </td>
      <td className="px-5 py-4 text-sm text-neutral-600">{lesson.sortOrder}</td>
      <td className="px-5 py-4">
        <StatusBadge isPublished={lesson.isPublished} />
      </td>
      <td className="px-5 py-4">
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/admin/lecciones/${lesson.id}`}
            className="rounded-md border border-border px-3 py-2 text-sm font-semibold text-foreground"
          >
            Editar
          </Link>
          <form
            action={toggleLessonPublished.bind(
              null,
              lesson.id,
              !lesson.isPublished,
            )}
          >
            <button
              type="submit"
              className="rounded-md border border-border px-3 py-2 text-sm font-semibold text-neutral-700"
            >
              {lesson.isPublished ? "Despublicar" : "Publicar"}
            </button>
          </form>
        </div>
      </td>
    </tr>
  );
}

function LessonsTable({ lessons }: { lessons: AdminLesson[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[860px] border-collapse text-left">
        <thead className="bg-surface-muted text-xs uppercase tracking-[0.14em] text-neutral-500">
          <tr>
            <th className="px-5 py-3 font-semibold">Leccion</th>
            <th className="px-5 py-3 font-semibold">Modulo</th>
            <th className="px-5 py-3 font-semibold">Video</th>
            <th className="px-5 py-3 font-semibold">Orden</th>
            <th className="px-5 py-3 font-semibold">Estado</th>
            <th className="px-5 py-3 font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {lessons.map((lesson) => (
            <LessonRow key={lesson.id} lesson={lesson} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function AdminLeccionesPage({
  searchParams,
}: AdminLeccionesPageProps) {
  const { program: programId } = await searchParams;
  const [lessons, programs] = await Promise.all([
    listAdminLessons(programId),
    listProgramOptions(),
  ]);

  // Group by program for the "all programs" view.
  const groups = new Map<string, { title: string; lessons: AdminLesson[] }>();
  for (const lesson of lessons) {
    const existing = groups.get(lesson.programId);
    if (existing) {
      existing.lessons.push(lesson);
    } else {
      groups.set(lesson.programId, {
        title: lesson.program.title,
        lessons: [lesson],
      });
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin"
        title="Lecciones"
        description="Edita el contenido consumible y configura aquí el video de cada lección. Flujo operativo: Programa → Módulo → Lección → Video."
        action={
          <Link
            href="/admin/lecciones/nueva"
            className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
          >
            Nueva leccion
          </Link>
        }
      />

      <Card className="border-teal-200 bg-teal-50">
        <p className="text-sm font-semibold text-teal-900">
          Los videos se cargan desde la lección.
        </p>
        <p className="mt-2 text-sm leading-6 text-teal-800">
          Cada lección puede existir sin video, pero si ya tienes el asset,
          entra a Editar y configura URL, proveedor, miniatura, duración y
          estado preview desde el formulario de la lección.
        </p>
      </Card>

      <ProgramFilter programs={programs} selectedProgramId={programId} />

      {lessons.length === 0 ? (
        <Card>
          <p className="text-sm text-neutral-600">
            {programId
              ? "Este programa no tiene lecciones todavía."
              : "No hay lecciones creadas."}
          </p>
        </Card>
      ) : programId ? (
        <Card className="overflow-hidden p-0">
          <LessonsTable lessons={lessons} />
        </Card>
      ) : (
        <div className="space-y-6">
          {Array.from(groups.values()).map((group) => (
            <div key={group.title} className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-neutral-500">
                {group.title}
              </h2>
              <Card className="overflow-hidden p-0">
                <LessonsTable lessons={group.lessons} />
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
