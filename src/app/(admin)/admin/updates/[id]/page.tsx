import Link from "next/link";
import { notFound } from "next/navigation";

import { BuilderUpdateForm } from "@/components/admin/content/content-forms";
import { Card } from "@/components/shared/card";
import { PageHeader } from "@/components/shared/page-header";
import { updateBuilderUpdate } from "@/lib/actions/admin-content";
import { getAdminBuilderUpdate } from "@/lib/services";

type EditBuilderUpdatePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditBuilderUpdatePage({
  params,
}: EditBuilderUpdatePageProps) {
  const { id } = await params;
  const update = await getAdminBuilderUpdate(id);

  if (!update) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin"
        title="Editar novedad"
        description={update.title}
        action={
          <Link
            href="/admin/updates"
            className="rounded-md border border-border px-4 py-2 text-sm font-semibold text-foreground"
          >
            Volver
          </Link>
        }
      />
      <Card>
        <BuilderUpdateForm
          action={updateBuilderUpdate.bind(null, update.id)}
          update={update}
          submitLabel="Guardar cambios"
        />
      </Card>
    </div>
  );
}
