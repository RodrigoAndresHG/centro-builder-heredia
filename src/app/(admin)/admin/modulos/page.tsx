import Link from "next/link";

import { StatusBadge } from "@/components/admin/content/status-badge";
import { Card } from "@/components/shared/card";
import { PageHeader } from "@/components/shared/page-header";
import { toggleModulePublished } from "@/lib/actions/admin-content";
import { listAdminModules } from "@/lib/services";

export default async function AdminModulosPage() {
  const modules = await listAdminModules();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin"
        title="Modulos"
        description="Ordena y publica los bloques de cada programa."
        action={
          <Link
            href="/admin/modulos/nuevo"
            className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
          >
            Nuevo modulo
          </Link>
        }
      />

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead className="bg-surface-muted text-xs uppercase tracking-[0.14em] text-neutral-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Modulo</th>
                <th className="px-5 py-3 font-semibold">Programa</th>
                <th className="px-5 py-3 font-semibold">Orden</th>
                <th className="px-5 py-3 font-semibold">Estado</th>
                <th className="px-5 py-3 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {modules.map((module) => (
                <tr key={module.id}>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-foreground">{module.title}</p>
                    <p className="mt-1 text-sm text-neutral-500">{module.slug}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-neutral-600">
                    {module.program.title}
                  </td>
                  <td className="px-5 py-4 text-sm text-neutral-600">
                    {module.sortOrder}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge isPublished={module.isPublished} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/admin/modulos/${module.id}`}
                        className="rounded-md border border-border px-3 py-2 text-sm font-semibold text-foreground"
                      >
                        Editar
                      </Link>
                      <form
                        action={toggleModulePublished.bind(
                          null,
                          module.id,
                          !module.isPublished,
                        )}
                      >
                        <button
                          type="submit"
                          className="rounded-md border border-border px-3 py-2 text-sm font-semibold text-neutral-700"
                        >
                          {module.isPublished ? "Despublicar" : "Publicar"}
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {modules.length === 0 ? (
          <div className="p-5 text-sm text-neutral-600">No hay modulos creados.</div>
        ) : null}
      </Card>
    </div>
  );
}
