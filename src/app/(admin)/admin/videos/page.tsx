import Link from "next/link";

import { Card } from "@/components/shared/card";
import { PageHeader } from "@/components/shared/page-header";
import { listAdminVideoLessons } from "@/lib/services";

function formatDuration(seconds: number | null) {
  if (!seconds) {
    return "Sin duración";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export default async function AdminVideosPage() {
  const lessons = await listAdminVideoLessons();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin"
        title="Videos"
        description="Índice operativo de videos ligados a lecciones. Para cargar o editar un video, entra a la lección correspondiente."
        action={
          <Link
            href="/admin/lecciones"
            className="rounded-md border border-border px-4 py-2 text-sm font-semibold text-foreground"
          >
            Ver lecciones
          </Link>
        }
      />

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] border-collapse text-left">
            <thead className="bg-surface-muted text-xs uppercase tracking-[0.14em] text-neutral-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Video</th>
                <th className="px-5 py-3 font-semibold">Lección</th>
                <th className="px-5 py-3 font-semibold">Programa / módulo</th>
                <th className="px-5 py-3 font-semibold">Duración</th>
                <th className="px-5 py-3 font-semibold">Preview</th>
                <th className="px-5 py-3 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {lessons.map((lesson) => (
                <tr key={lesson.id}>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-foreground">
                      {lesson.videoTitle ?? lesson.title}
                    </p>
                    <p className="mt-1 max-w-xs truncate text-sm text-neutral-500">
                      {lesson.videoProvider ?? "Proveedor no definido"} ·{" "}
                      {lesson.videoUrl}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-sm text-neutral-600">
                    {lesson.title}
                  </td>
                  <td className="px-5 py-4 text-sm text-neutral-600">
                    {lesson.program.title}
                    <br />
                    <span className="text-neutral-500">
                      {lesson.module?.title ?? "Sin módulo"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-neutral-600">
                    {formatDuration(lesson.videoDuration)}
                  </td>
                  <td className="px-5 py-4 text-sm text-neutral-600">
                    {lesson.isPreview ? "Sí" : "No"}
                  </td>
                  <td className="px-5 py-4">
                    <Link
                      href={`/admin/lecciones/${lesson.id}`}
                      className="rounded-md border border-border px-3 py-2 text-sm font-semibold text-foreground"
                    >
                      Editar lección
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {lessons.length === 0 ? (
          <div className="p-5 text-sm text-neutral-600">
            Todavía no hay videos cargados. Carga el video desde el formulario
            de una lección.
          </div>
        ) : null}
      </Card>
    </div>
  );
}
