import Link from "next/link";
import { notFound } from "next/navigation";

import { AccessForm } from "@/components/admin/access/access-form";
import { Card } from "@/components/shared/card";
import { PageHeader } from "@/components/shared/page-header";
import { updateManualAccess } from "@/lib/actions/admin-access";
import { getAdminAccess, listAccessFormOptions } from "@/lib/services";

type EditAccessPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditAccessPage({ params }: EditAccessPageProps) {
  const { id } = await params;
  const [access, options] = await Promise.all([
    getAdminAccess(id),
    listAccessFormOptions(),
  ]);

  if (!access) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin"
        title="Editar acceso"
        description={access.user.email ?? "Usuario sin email"}
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
          action={updateManualAccess.bind(null, access.id)}
          access={access}
          users={options.users}
          products={options.products}
          programs={options.programs}
          submitLabel="Guardar cambios"
        />
      </Card>
    </div>
  );
}
