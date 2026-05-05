import Link from "next/link";
import { notFound } from "next/navigation";

import { AccessForm } from "@/components/admin/access/access-form";
import { Card } from "@/components/shared/card";
import { PageHeader } from "@/components/shared/page-header";
import { updateManualAccess } from "@/lib/actions/admin-access";
import { getAdminAccess, listAccessFormOptions } from "@/lib/services";

type EditAccessPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
};

export default async function EditAccessPage({
  params,
  searchParams,
}: EditAccessPageProps) {
  const { id } = await params;
  const { saved } = await searchParams;
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
      {saved === "1" ? (
        <Card className="border-emerald-200 bg-emerald-50">
          <p className="text-sm font-semibold text-emerald-800">
            Acceso creado correctamente. Revisa usuario, destino, origen y
            fechas antes de operarlo.
          </p>
        </Card>
      ) : null}
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
