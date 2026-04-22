import Link from "next/link";

import { StatusBadge } from "@/components/admin/content/status-badge";
import { Card } from "@/components/shared/card";
import { PageHeader } from "@/components/shared/page-header";
import { toggleProgramPublished } from "@/lib/actions/admin-content";
import { listAdminPrograms } from "@/lib/services";

export default async function AdminProgramasPage() {
  const programs = await listAdminPrograms();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin"
        title="Programas"
        description="Gestiona la estructura principal visible en el area privada."
        action={
          <Link
            href="/admin/programas/nuevo"
            className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
          >
            Nuevo programa
          </Link>
        }
      />

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead className="bg-surface-muted text-xs uppercase tracking-[0.14em] text-neutral-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Programa</th>
                <th className="px-5 py-3 font-semibold">Producto</th>
                <th className="px-5 py-3 font-semibold">Contenido</th>
                <th className="px-5 py-3 font-semibold">Estado</th>
                <th className="px-5 py-3 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {programs.map((program) => (
                <tr key={program.id}>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-foreground">{program.title}</p>
                    <p className="mt-1 text-sm text-neutral-500">{program.slug}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-neutral-600">
                    {program.product?.name ?? "Sin producto"}
                  </td>
                  <td className="px-5 py-4 text-sm text-neutral-600">
                    {program.modules.length} modulos · {program.lessons.length} lecciones
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge isPublished={program.isPublished} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/admin/programas/${program.id}`}
                        className="rounded-md border border-border px-3 py-2 text-sm font-semibold text-foreground"
                      >
                        Editar
                      </Link>
                      <form
                        action={toggleProgramPublished.bind(
                          null,
                          program.id,
                          !program.isPublished,
                        )}
                      >
                        <button
                          type="submit"
                          className="rounded-md border border-border px-3 py-2 text-sm font-semibold text-neutral-700"
                        >
                          {program.isPublished ? "Despublicar" : "Publicar"}
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {programs.length === 0 ? (
          <div className="p-5 text-sm text-neutral-600">No hay programas creados.</div>
        ) : null}
      </Card>
    </div>
  );
}
