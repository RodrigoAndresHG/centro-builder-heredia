import Link from "next/link";

import { Card } from "@/components/shared/card";
import { PageHeader } from "@/components/shared/page-header";
import { listAdminProducts } from "@/lib/services";

export default async function AdminProductosPage() {
  const products = await listAdminProducts();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin"
        title="Productos"
        description="Productos comerciales que se venden vía Stripe Checkout. Cada producto puede desbloquear uno o varios programas."
        action={
          <Link
            href="/admin/productos/nuevo"
            className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
          >
            Nuevo producto
          </Link>
        }
      />

      <Card className="border-amber-200 bg-amber-50">
        <p className="text-sm font-semibold text-amber-900">
          La fuente de verdad de los precios vive en Stripe.
        </p>
        <p className="mt-2 text-sm leading-6 text-amber-800">
          Crea primero el precio en Stripe Dashboard (modo Test o Live según
          corresponda), copia el Price ID (empieza con <code>price_</code>) y
          pégalo en el formulario. Sin Stripe Price ID el producto existe en tu
          LMS pero no se puede comprar vía Checkout.
        </p>
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] border-collapse text-left">
            <thead className="bg-surface-muted text-xs uppercase tracking-[0.14em] text-neutral-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Producto</th>
                <th className="px-5 py-3 font-semibold">Stripe Price</th>
                <th className="px-5 py-3 font-semibold">Estado</th>
                <th className="px-5 py-3 font-semibold">Uso</th>
                <th className="px-5 py-3 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-foreground">
                      {product.name}
                    </p>
                    <p className="mt-1 text-sm text-neutral-500">
                      {product.slug}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-sm text-neutral-600">
                    {product.stripePriceId ? (
                      <code className="rounded bg-surface-muted px-2 py-1 text-xs">
                        {product.stripePriceId}
                      </code>
                    ) : (
                      <span className="text-amber-700">
                        Sin Price ID — no comprable
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        product.isActive
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-neutral-100 text-neutral-600"
                      }`}
                    >
                      {product.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-neutral-600">
                    {product._count.programs} programa
                    {product._count.programs === 1 ? "" : "s"} ·{" "}
                    {product._count.purchases} compra
                    {product._count.purchases === 1 ? "" : "s"} ·{" "}
                    {product._count.accesses} acceso
                    {product._count.accesses === 1 ? "" : "s"}
                  </td>
                  <td className="px-5 py-4">
                    <Link
                      href={`/admin/productos/${product.id}`}
                      className="rounded-md border border-border px-3 py-2 text-sm font-semibold text-foreground"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {products.length === 0 ? (
          <div className="p-5 text-sm text-neutral-600">
            Todavía no hay productos creados. Crea el primero para empezar a
            vender vía Stripe.
          </div>
        ) : null}
      </Card>
    </div>
  );
}
