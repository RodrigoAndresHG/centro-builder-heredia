import Link from "next/link";

import { AccessForm } from "@/components/admin/access/access-form";
import { Card } from "@/components/shared/card";
import { PageHeader } from "@/components/shared/page-header";
import { createManualAccess } from "@/lib/actions/admin-access";
import { listAccessFormOptions } from "@/lib/services";

export default async function NewAccessPage() {
  const { users, products, programs } = await listAccessFormOptions();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin"
        title="Nuevo acceso"
        description="Crea un acceso manual para una cuenta existente. Este flujo no reemplaza el pago oficial por Stripe."
        action={
          <Link
            href="/admin/accesos"
            className="rounded-md border border-border px-4 py-2 text-sm font-semibold text-foreground"
          >
            Volver
          </Link>
        }
      />
      <Card>
        <AccessForm
          action={createManualAccess}
          users={users}
          products={products}
          programs={programs}
          submitLabel="Crear acceso"
        />
      </Card>
    </div>
  );
}
