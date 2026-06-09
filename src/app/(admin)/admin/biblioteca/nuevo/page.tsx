import Link from "next/link";

import { PromptAssetForm } from "@/components/admin/content/content-forms";
import { Card } from "@/components/shared/card";
import { PageHeader } from "@/components/shared/page-header";
import { createPromptAsset } from "@/lib/actions/admin-content";

export default function NewPromptAssetPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin"
        title="Nuevo prompt"
        description="Crea un prompt listo para copiar. Marca Premium si solo debe verlo quien ya compró un programa."
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
        <PromptAssetForm action={createPromptAsset} submitLabel="Crear prompt" />
      </Card>
    </div>
  );
}
