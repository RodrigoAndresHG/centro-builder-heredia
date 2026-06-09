import Link from "next/link";
import { notFound } from "next/navigation";

import { PromptAssetForm } from "@/components/admin/content/content-forms";
import { DeleteEntityDangerZone } from "@/components/admin/content/danger-zone";
import { Card } from "@/components/shared/card";
import { PageHeader } from "@/components/shared/page-header";
import {
  deletePromptAsset,
  updatePromptAsset,
} from "@/lib/actions/admin-content";
import { getAdminPromptAsset } from "@/lib/services";

type EditPromptAssetPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPromptAssetPage({
  params,
}: EditPromptAssetPageProps) {
  const { id } = await params;
  const promptAsset = await getAdminPromptAsset(id);

  if (!promptAsset) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin"
        title="Editar prompt"
        description={`${promptAsset.title} · ${promptAsset.category}`}
        action={
          <Link
            href="/admin/biblioteca"
            className="rounded-md border border-border px-4 py-2 text-sm font-semibold text-foreground"
          >
            Volver
          </Link>
        }
      />
      <Card>
        <PromptAssetForm
          action={updatePromptAsset.bind(null, promptAsset.id)}
          promptAsset={promptAsset}
          submitLabel="Guardar cambios"
        />
      </Card>

      <DeleteEntityDangerZone
        action={deletePromptAsset.bind(null, promptAsset.id)}
        title="Zona de peligro"
        description="Eliminar este prompt lo quita de la biblioteca de forma permanente. Esta acción no se puede deshacer."
        confirmMessage={`¿Eliminar el prompt "${promptAsset.title}"?`}
        buttonLabel="Eliminar prompt"
      />
    </div>
  );
}
