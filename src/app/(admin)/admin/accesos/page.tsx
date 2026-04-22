import Link from "next/link";

import { AccessStatusBadge } from "@/components/admin/access/access-form";
import { Card } from "@/components/shared/card";
import { PageHeader } from "@/components/shared/page-header";
import { toggleAccessStatus } from "@/lib/actions/admin-access";
import { listAdminAccesses } from "@/lib/services";

function formatDate(date?: Date | null) {
  if (!date) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
}

export default async function AdminAccesosPage() {
  const accesses = await listAdminAccesses();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin"
        title="Accesos"
        description="Gestiona permisos activos por producto o programa y corrige accesos manualmente cuando sea necesario."
        action={
          <Link
            href="/admin/accesos/nuevo"
            className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
          >
            Nuevo acceso
          </Link>
        }
      />

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse text-left">
            <thead className="bg-surface-muted text-xs uppercase tracking-[0.14em] text-neutral-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Usuario</th>
                <th className="px-5 py-3 font-semibold">Acceso</th>
                <th className="px-5 py-3 font-semibold">Estado</th>
                <th className="px-5 py-3 font-semibold">Fechas</th>
                <th className="px-5 py-3 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {accesses.map((access) => {
                const target =
                  access.product?.name ??
                  access.program?.title ??
                  "Destino no definido";
                const targetType = access.product
                  ? "Producto"
                  : access.program
                    ? "Programa"
                    : "Sin destino";

                return (
                  <tr key={access.id}>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-foreground">
                        {access.user.email ?? "Usuario sin email"}
                      </p>
                      <p className="mt-1 text-sm text-neutral-500">
                        {access.user.name ?? "Sin nombre"} · {access.user.roleKey}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                        {targetType}
                      </p>
                      <p className="mt-1 text-sm font-medium text-foreground">
                        {target}
                      </p>
                      {access.program?.product ? (
                        <p className="mt-1 text-sm text-neutral-500">
                          Producto: {access.program.product.name}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-5 py-4">
                      <AccessStatusBadge status={access.status} />
                    </td>
                    <td className="px-5 py-4 text-sm text-neutral-600">
                      <p>Inicio: {formatDate(access.startsAt)}</p>
                      <p>Expira: {formatDate(access.expiresAt)}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/admin/accesos/${access.id}`}
                          className="rounded-md border border-border px-3 py-2 text-sm font-semibold text-foreground"
                        >
                          Editar
                        </Link>
                        <form
                          action={toggleAccessStatus.bind(
                            null,
                            access.id,
                            access.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
                          )}
                        >
                          <button
                            type="submit"
                            className="rounded-md border border-border px-3 py-2 text-sm font-semibold text-neutral-700"
                          >
                            {access.status === "ACTIVE" ? "Desactivar" : "Activar"}
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {accesses.length === 0 ? (
          <div className="p-5 text-sm text-neutral-600">
            No hay accesos creados todavia.
          </div>
        ) : null}
      </Card>
    </div>
  );
}
