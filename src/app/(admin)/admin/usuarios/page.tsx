import { Card } from "@/components/shared/card";
import { PageHeader } from "@/components/shared/page-header";
import { listAdminUsers } from "@/lib/services";

function getRoleLabel(roleKey: string) {
  if (roleKey === "ADMIN") {
    return "Admin";
  }

  if (roleKey === "USUARIO_PAGO") {
    return "Usuario pago";
  }

  return "Invitado";
}

function getProviderLabel(provider?: string | null) {
  if (provider === "google") {
    return "Google";
  }

  if (provider === "nodemailer") {
    return "Correo";
  }

  return "Sin proveedor";
}

export default async function AdminUsuariosPage() {
  const users = await listAdminUsers();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin"
        title="Usuarios"
        description="Cuentas reales del LMS. Los permisos comerciales se gestionan desde Accesos."
      />

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] border-collapse text-left">
            <thead className="bg-surface-muted text-xs uppercase tracking-[0.14em] text-neutral-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Usuario</th>
                <th className="px-5 py-3 font-semibold">Rol</th>
                <th className="px-5 py-3 font-semibold">Entrada</th>
                <th className="px-5 py-3 font-semibold">Accesos</th>
                <th className="px-5 py-3 font-semibold">Compras</th>
                <th className="px-5 py-3 font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => {
                const activeAccesses = user.accesses.filter(
                  (access) => access.status === "ACTIVE",
                );

                return (
                  <tr key={user.id}>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-foreground">
                        {user.name ?? "Sin nombre"}
                      </p>
                      <p className="mt-1 text-sm text-neutral-500">
                        {user.email ?? "Sin correo"}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-neutral-700">
                      {getRoleLabel(user.roleKey)}
                    </td>
                    <td className="px-5 py-4 text-sm text-neutral-600">
                      {getProviderLabel(user.accounts[0]?.provider)}
                    </td>
                    <td className="px-5 py-4 text-sm text-neutral-600">
                      {activeAccesses.length} activos
                    </td>
                    <td className="px-5 py-4 text-sm text-neutral-600">
                      {user.purchases.length}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          activeAccesses.length > 0
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-neutral-100 text-neutral-600"
                        }`}
                      >
                        {activeAccesses.length > 0
                          ? "Con acceso"
                          : "Sin acceso"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {users.length === 0 ? (
          <div className="p-5 text-sm text-neutral-600">
            No hay usuarios registrados todavía.
          </div>
        ) : null}
      </Card>
    </div>
  );
}
