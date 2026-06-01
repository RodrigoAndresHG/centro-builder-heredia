import Link from "next/link";

import { ProgramFilter } from "@/components/admin/content/program-filter";
import { StatusBadge } from "@/components/admin/content/status-badge";
import { Card } from "@/components/shared/card";
import { PageHeader } from "@/components/shared/page-header";
import { toggleModulePublished } from "@/lib/actions/admin-content";
import { listAdminModules, listProgramOptions } from "@/lib/services";

type AdminModulosPageProps = {
  searchParams: Promise<{ program?: string }>;
};

type AdminModule = Awaited<ReturnType<typeof listAdminModules>>[number];

function ModuleRow({ mod }: { mod: AdminModule }) {
  return (
    <tr>
      <td className="px-5 py-4">
        <p className="font-semibold text-foreground">{mod.title}</p>
        <p className="mt-1 text-sm text-neutral-500">{mod.slug}</p>
      </td>
      <td className="px-5 py-4 text-sm text-neutral-600">
        {mod.lessons.length} lección
        {mod.lessons.length === 1 ? "" : "es"}
      </td>
      <td className="px-5 py-4 text-sm text-neutral-600">{mod.sortOrder}</td>
      <td className="px-5 py-4">
        <StatusBadge isPublished={mod.isPublished} />
      </td>
      <td className="px-5 py-4">
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/admin/modulos/${mod.id}`}
            className="rounded-md border border-border px-3 py-2 text-sm font-semibold text-foreground"
          >
            Editar
          </Link>
          <form
            action={toggleModulePublished.bind(null, mod.id, !mod.isPublished)}
          >
            <button
              type="submit"
              className="rounded-md border border-border px-3 py-2 text-sm font-semibold text-neutral-700"
            >
              {mod.isPublished ? "Despublicar" : "Publicar"}
            </button>
          </form>
        </div>
      </td>
    </tr>
  );
}

function ModulesTable({ modules }: { modules: AdminModule[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] border-collapse text-left">
        <thead className="bg-surface-muted text-xs uppercase tracking-[0.14em] text-neutral-500">
          <tr>
            <th className="px-5 py-3 font-semibold">Modulo</th>
            <th className="px-5 py-3 font-semibold">Lecciones</th>
            <th className="px-5 py-3 font-semibold">Orden</th>
            <th className="px-5 py-3 font-semibold">Estado</th>
            <th className="px-5 py-3 font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {modules.map((mod) => (
            <ModuleRow key={mod.id} mod={mod} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function AdminModulosPage({
  searchParams,
}: AdminModulosPageProps) {
  const { program: programId } = await searchParams;
  const [modules, programs] = await Promise.all([
    listAdminModules(programId),
    listProgramOptions(),
  ]);

  // Group by program for the "all programs" view.
  const groups = new Map<string, { title: string; modules: AdminModule[] }>();
  for (const mod of modules) {
    const existing = groups.get(mod.programId);
    if (existing) {
      existing.modules.push(mod);
    } else {
      groups.set(mod.programId, {
        title: mod.program.title,
        modules: [mod],
      });
    }
  }

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

      <ProgramFilter programs={programs} selectedProgramId={programId} />

      {modules.length === 0 ? (
        <Card>
          <p className="text-sm text-neutral-600">
            {programId
              ? "Este programa no tiene módulos todavía."
              : "No hay modulos creados."}
          </p>
        </Card>
      ) : programId ? (
        <Card className="overflow-hidden p-0">
          <ModulesTable modules={modules} />
        </Card>
      ) : (
        <div className="space-y-6">
          {Array.from(groups.values()).map((group) => (
            <div key={group.title} className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-neutral-500">
                {group.title}
              </h2>
              <Card className="overflow-hidden p-0">
                <ModulesTable modules={group.modules} />
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
