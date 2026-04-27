import Link from "next/link";

import { BuilderUpdateForm } from "@/components/admin/content/content-forms";
import { Card } from "@/components/shared/card";
import { PageHeader } from "@/components/shared/page-header";
import { createBuilderUpdate } from "@/lib/actions/admin-content";

export default function NewBuilderUpdatePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin"
        title="Nueva novedad"
        description="Crea una publicación útil para el feed privado de Builder."
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
          action={createBuilderUpdate}
          submitLabel="Crear novedad"
        />
      </Card>
    </div>
  );
}
