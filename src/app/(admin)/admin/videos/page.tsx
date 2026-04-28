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
        title="Biblioteca de videos"
        description="Índice operativo de videos ya vinculados a lecciones. Esta pantalla sirve para auditar y localizar videos, no para cargarlos."
        action={
          <Link
            href="/admin/lecciones"
            className="rounded-md border border-border px-4 py-2 text-sm font-semibold text-foreground"
          >
            Ver lecciones
          </Link>
        }
      />

      <Card className="border-amber-200 bg-amber-50">
        <p className="text-sm font-semibold text-amber-900">
          La carga y edición principal del video se realiza desde cada lección.
        </p>
        <p className="mt-2 text-sm leading-6 text-amber-800">
          Si quieres subir, cambiar URL, definir proveedor, miniatura, duración
          o preview, entra a Lecciones y edita la lección correspondiente.
          Relación operativa: Programa → Módulo → Lección → Video.
        </p>
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] border-collapse text-left">
            <thead className="bg-surface-muted text-xs uppercase tracking-[0.14em] text-neutral-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Video</th>
                <th className="px-5 py-3 font-semibold">Lección</th>
                <th className="px-5 py-3 font-semibold">Programa / módulo</th>
                <th className="px-5 py-3 font-semibold">Estado</th>
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
                      {lesson.streamVideoId
                        ? `Stream ID ${lesson.streamVideoId}`
                        : lesson.videoUrl}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-sm text-neutral-600">
                    {lesson.title}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        lesson.videoStatus === "READY"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {lesson.videoStatus}
                    </span>
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
