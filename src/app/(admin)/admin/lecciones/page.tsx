import Link from "next/link";

import { StatusBadge } from "@/components/admin/content/status-badge";
import { Card } from "@/components/shared/card";
import { PageHeader } from "@/components/shared/page-header";
import { toggleLessonPublished } from "@/lib/actions/admin-content";
import { listAdminLessons } from "@/lib/services";

export default async function AdminLeccionesPage() {
  const lessons = await listAdminLessons();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin"
        title="Lecciones"
        description="Edita el contenido consumible que aparece en el area privada."
        action={
          <Link
            href="/admin/lecciones/nueva"
            className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
          >
            Nueva leccion
          </Link>
        }
      />

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead className="bg-surface-muted text-xs uppercase tracking-[0.14em] text-neutral-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Leccion</th>
                <th className="px-5 py-3 font-semibold">Programa</th>
                <th className="px-5 py-3 font-semibold">Modulo</th>
                <th className="px-5 py-3 font-semibold">Orden</th>
                <th className="px-5 py-3 font-semibold">Estado</th>
                <th className="px-5 py-3 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {lessons.map((lesson) => (
                <tr key={lesson.id}>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-foreground">{lesson.title}</p>
                    <p className="mt-1 text-sm text-neutral-500">{lesson.slug}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-neutral-600">
                    {lesson.program.title}
                  </td>
                  <td className="px-5 py-4 text-sm text-neutral-600">
                    {lesson.module?.title ?? "Sin modulo"}
                  </td>
                  <td className="px-5 py-4 text-sm text-neutral-600">
                    {lesson.sortOrder}
                  </td>
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
              ))}
            </tbody>
          </table>
        </div>
        {lessons.length === 0 ? (
          <div className="p-5 text-sm text-neutral-600">No hay lecciones creadas.</div>
        ) : null}
      </Card>
    </div>
  );
}
