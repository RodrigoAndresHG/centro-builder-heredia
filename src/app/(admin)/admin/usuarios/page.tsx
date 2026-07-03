import { Card } from "@/components/shared/card";
import { PageHeader } from "@/components/shared/page-header";
import {
  getSignupAttributionSummary,
  getWhatsappClickSummary,
  listAdminUsers,
} from "@/lib/services";

function sourceLabel(source?: string | null) {
  return source && source.length > 0 ? source : "Directo / sin fuente";
}

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

// Fecha de registro en hora de Ecuador (el servidor corre en UTC).
const registroFormatter = new Intl.DateTimeFormat("es-EC", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "America/Guayaquil",
});

const registroHoraFormatter = new Intl.DateTimeFormat("es-EC", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "America/Guayaquil",
});

export default async function AdminUsuariosPage() {
  const [users, attribution, whatsappClicks] = await Promise.all([
    listAdminUsers(),
    getSignupAttributionSummary(),
    getWhatsappClickSummary(),
  ]);

  const totalRegistros = attribution.reduce((sum, row) => sum + row.count, 0);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin"
        title="Usuarios"
        description="Cuentas reales del LMS. Los permisos comerciales se gestionan desde Accesos."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
            Registros por fuente
          </p>
          <p className="mt-1 text-2xl font-semibold text-foreground">
            {totalRegistros}
            <span className="ml-2 text-sm font-normal text-neutral-500">
              registros totales
            </span>
          </p>
          <div className="mt-4 space-y-2">
            {attribution.length === 0 ? (
              <p className="text-sm text-neutral-500">Aún no hay registros.</p>
            ) : (
              attribution.map((row) => {
                const pct =
                  totalRegistros > 0
                    ? Math.round((row.count / totalRegistros) * 100)
                    : 0;
                return (
                  <div
                    key={row.source ?? "null"}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <span className="truncate text-neutral-700">
                      {sourceLabel(row.source)}
                    </span>
                    <span className="shrink-0 font-semibold text-foreground">
                      {row.count}
                      <span className="ml-1 text-xs font-normal text-neutral-500">
                        ({pct}%)
                      </span>
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
            Clics al canal de WhatsApp por fuente
          </p>
          <div className="mt-4 space-y-2">
            {whatsappClicks.length === 0 ? (
              <p className="text-sm text-neutral-500">
                Aún no hay clics registrados (vía /go/whatsapp).
              </p>
            ) : (
              whatsappClicks.map((row) => (
                <div
                  key={row.src ?? "null"}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <span className="truncate text-neutral-700">
                    {sourceLabel(row.src)}
                  </span>
                  <span className="shrink-0 font-semibold text-foreground">
                    {row.count}
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1080px] border-collapse text-left">
            <thead className="bg-surface-muted text-xs uppercase tracking-[0.14em] text-neutral-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Usuario</th>
                <th className="px-5 py-3 font-semibold">Registro</th>
                <th className="px-5 py-3 font-semibold">Rol</th>
                <th className="px-5 py-3 font-semibold">Entrada</th>
                <th className="px-5 py-3 font-semibold">Fuente</th>
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
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-foreground">
                        {registroFormatter.format(user.createdAt)}
                      </p>
                      <p className="mt-1 text-xs text-neutral-500">
                        {registroHoraFormatter.format(user.createdAt)}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-neutral-700">
                      {getRoleLabel(user.roleKey)}
                    </td>
                    <td className="px-5 py-4 text-sm text-neutral-600">
                      {getProviderLabel(user.accounts[0]?.provider)}
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-neutral-700">
                        {sourceLabel(user.utmSource)}
                      </p>
                      {user.utmCampaign ? (
                        <p className="mt-1 text-xs text-neutral-500">
                          {user.utmCampaign}
                        </p>
                      ) : null}
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
