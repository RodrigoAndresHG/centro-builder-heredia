import Link from "next/link";

import { StatusBadge } from "@/components/admin/content/status-badge";
import { Card } from "@/components/shared/card";
import { PageHeader } from "@/components/shared/page-header";
import { togglePromptAssetPublished } from "@/lib/actions/admin-content";
import { listAdminPromptAssets } from "@/lib/services";

const platformLabels: Record<string, string> = {
  CLAUDE: "Claude",
  CHATGPT: "ChatGPT",
  GEMINI: "Gemini",
  MULTI: "Multi-IA",
};

export default async function AdminBibliotecaPage() {
  const promptAssets = await listAdminPromptAssets();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin"
        title="Biblioteca de Prompts"
        description="Prompts listos para copiar que ven tus usuarios en /app/biblioteca. Agrupados por categoría y filtrables por plataforma."
        action={
          <Link
            href="/admin/biblioteca/nuevo"
            className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
          >
            Nuevo prompt
          </Link>
        }
      />

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] border-collapse text-left">
            <thead className="bg-surface-muted text-xs uppercase tracking-[0.14em] text-neutral-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Prompt</th>
                <th className="px-5 py-3 font-semibold">Categoría</th>
                <th className="px-5 py-3 font-semibold">Plataforma</th>
                <th className="px-5 py-3 font-semibold">Acceso</th>
                <th className="px-5 py-3 font-semibold">Estado</th>
                <th className="px-5 py-3 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {promptAssets.map((promptAsset) => (
                <tr key={promptAsset.id}>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-foreground">
                      {promptAsset.title}
                    </p>
                    {promptAsset.description ? (
                      <p className="mt-1 max-w-sm truncate text-sm text-neutral-500">
                        {promptAsset.description}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-5 py-4 text-sm text-neutral-600">
                    {promptAsset.category}
                  </td>
                  <td className="px-5 py-4 text-sm text-neutral-600">
                    {platformLabels[promptAsset.platform] ?? promptAsset.platform}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        promptAsset.isPremium
                          ? "bg-amber-50 text-amber-700"
                          : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {promptAsset.isPremium ? "Premium" : "Libre"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge isPublished={promptAsset.isPublished} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/admin/biblioteca/${promptAsset.id}`}
                        className="rounded-md border border-border px-3 py-2 text-sm font-semibold text-foreground"
                      >
                        Editar
                      </Link>
                      <form
                        action={togglePromptAssetPublished.bind(
                          null,
                          promptAsset.id,
                          !promptAsset.isPublished,
                        )}
                      >
                        <button
                          type="submit"
                          className="rounded-md border border-border px-3 py-2 text-sm font-semibold text-neutral-700"
                        >
                          {promptAsset.isPublished ? "Despublicar" : "Publicar"}
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {promptAssets.length === 0 ? (
          <div className="p-5 text-sm text-neutral-600">
            Todavía no hay prompts. Crea el primero para estrenar la biblioteca.
          </div>
        ) : null}
      </Card>
    </div>
  );
}
