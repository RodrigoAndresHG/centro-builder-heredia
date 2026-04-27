import Link from "next/link";

import { StatusBadge } from "@/components/admin/content/status-badge";
import { Card } from "@/components/shared/card";
import { PageHeader } from "@/components/shared/page-header";
import { toggleBuilderUpdatePublished } from "@/lib/actions/admin-content";
import {
  getBuilderUpdateTypeLabel,
  listAdminBuilderUpdates,
} from "@/lib/services";

function formatDate(date: Date | null) {
  if (!date) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es", {
    dateStyle: "medium",
  }).format(date);
}

export default async function AdminUpdatesPage() {
  const updates = await listAdminBuilderUpdates();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin"
        title="Novedades Builder"
        description="Publica novedades, tips, señales de IA y recomendaciones útiles para usuarios del LMS."
        action={
          <Link
            href="/admin/updates/nuevo"
            className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
          >
            Nueva novedad
          </Link>
        }
      />

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[840px] border-collapse text-left">
            <thead className="bg-surface-muted text-xs uppercase tracking-[0.14em] text-neutral-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Publicación</th>
                <th className="px-5 py-3 font-semibold">Tipo</th>
                <th className="px-5 py-3 font-semibold">Estado</th>
                <th className="px-5 py-3 font-semibold">Fecha</th>
                <th className="px-5 py-3 font-semibold">Imagen</th>
                <th className="px-5 py-3 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {updates.map((update) => (
                <tr key={update.id}>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-foreground">
                      {update.title}
                    </p>
                    <p className="mt-1 max-w-xl text-sm leading-6 text-neutral-500">
                      {update.summary}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-neutral-700">
                    {getBuilderUpdateTypeLabel(update.type)}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge isPublished={update.isPublished} />
                  </td>
                  <td className="px-5 py-4 text-sm text-neutral-600">
                    {formatDate(update.publishedAt ?? update.createdAt)}
                  </td>
                  <td className="px-5 py-4 text-sm text-neutral-600">
                    {update.imageUrl ? "Con imagen" : "Sin imagen"}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/admin/updates/${update.id}`}
                        className="rounded-md border border-border px-3 py-2 text-sm font-semibold text-foreground"
                      >
                        Editar
                      </Link>
                      <form
                        action={toggleBuilderUpdatePublished.bind(
                          null,
                          update.id,
                          !update.isPublished,
                        )}
                      >
                        <button
                          type="submit"
                          className="rounded-md border border-border px-3 py-2 text-sm font-semibold text-neutral-700"
                        >
                          {update.isPublished ? "Despublicar" : "Publicar"}
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {updates.length === 0 ? (
          <div className="p-5 text-sm text-neutral-600">
            No hay novedades creadas todavía.
          </div>
        ) : null}
      </Card>
    </div>
  );
}
