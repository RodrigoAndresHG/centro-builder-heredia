import Link from "next/link";

import { ProductForm } from "@/components/admin/content/content-forms";
import { Card } from "@/components/shared/card";
import { PageHeader } from "@/components/shared/page-header";
import { createProduct } from "@/lib/actions/admin-content";

export default function NewProductPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin"
        title="Nuevo producto"
        description="Crea un nuevo SKU comercial. El precio real vive en Stripe."
        action={
          <Link
            href="/admin/productos"
            className="rounded-md border border-border px-4 py-2 text-sm font-semibold text-foreground"
          >
            Volver
          </Link>
        }
      />
      <Card>
        <ProductForm action={createProduct} submitLabel="Crear producto" />
      </Card>
    </div>
  );
}
