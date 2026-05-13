import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductForm } from "@/components/admin/content/content-forms";
import { Card } from "@/components/shared/card";
import { PageHeader } from "@/components/shared/page-header";
import { updateProduct } from "@/lib/actions/admin-content";
import { getAdminProduct } from "@/lib/services";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const product = await getAdminProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin"
        title="Editar producto"
        description={`${product.name} · ${
          product.isActive ? "Activo" : "Inactivo"
        }`}
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
        <ProductForm
          action={updateProduct.bind(null, product.id)}
          product={product}
          submitLabel="Guardar cambios"
        />
      </Card>

      <Card>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
          Programas asociados
        </p>
        {product.programs.length === 0 ? (
          <p className="mt-3 text-sm text-neutral-600">
            Este producto todavía no está asociado a ningún programa. Para
            asociarlo, ve a Programas y edita el programa correspondiente.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {product.programs.map((program) => (
              <li
                key={program.id}
                className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2"
              >
                <span className="text-sm font-semibold text-foreground">
                  {program.title}
                </span>
                <Link
                  href={`/admin/programas/${program.id}`}
                  className="text-xs font-semibold uppercase tracking-[0.12em] text-accent"
                >
                  Editar →
                </Link>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-6 text-xs leading-5 text-neutral-500">
          Resumen comercial: {product._count.purchases} compras registradas ·{" "}
          {product._count.accesses} accesos activos derivados (Stripe + manual).
        </p>
      </Card>
    </div>
  );
}
