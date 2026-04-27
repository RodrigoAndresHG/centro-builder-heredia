import { Card } from "@/components/shared/card";
import { PageHeader } from "@/components/shared/page-header";
import { listEarlyAccessLeads } from "@/lib/services";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatSource(source: string) {
  const labels: Record<string, string> = {
    home: "Home",
    program_build_ideacash: "Build IdeaCash",
  };

  return labels[source] ?? source;
}

function LeadStatusBadge({ status }: { status: string }) {
  const isPending = status === "PENDIENTE";

  return (
    <span
      className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-semibold ${
        isPending
          ? "border-amber-300/50 bg-amber-100 text-amber-800"
          : "border-border bg-surface-muted text-neutral-700"
      }`}
    >
      {status}
    </span>
  );
}

export default async function AdminEarlyAccessPage() {
  const leads = await listEarlyAccessLeads();
  const totalLeads = leads.length;
  const pendingLeads = leads.filter((lead) => lead.status === "PENDIENTE").length;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin"
        title="Early Access"
        description="Visualiza los interesados reales del pre-lanzamiento del LMS y del programa Build IdeaCash — Founder Access."
        action={
          <div className="rounded-md border border-border bg-surface px-4 py-2 text-sm font-semibold text-foreground">
            {totalLeads} leads
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Total captado
          </p>
          <p className="mt-3 text-3xl font-semibold text-foreground">
            {totalLeads}
          </p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Pendientes
          </p>
          <p className="mt-3 text-3xl font-semibold text-foreground">
            {pendingLeads}
          </p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Orden
          </p>
          <p className="mt-3 text-sm font-medium leading-6 text-neutral-600">
            Más recientes primero, listos para seguimiento comercial del
            lanzamiento.
          </p>
        </Card>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead className="bg-surface-muted text-xs uppercase tracking-[0.14em] text-neutral-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Lead</th>
                <th className="px-5 py-3 font-semibold">Source</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-foreground">{lead.name}</p>
                    <p className="mt-1 text-sm text-neutral-500">{lead.email}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-foreground">
                      {formatSource(lead.source)}
                    </p>
                    <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
                      {lead.source}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <LeadStatusBadge status={lead.status} />
                  </td>
                  <td className="px-5 py-4 text-sm text-neutral-600">
                    {formatDate(lead.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {leads.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm font-semibold text-foreground">
              Todavía no hay leads de acceso temprano.
            </p>
            <p className="mt-2 text-sm leading-6 text-neutral-600">
              Cuando alguien complete el formulario público, aparecerá aquí con
              su fuente, estado y fecha de captura.
            </p>
          </div>
        ) : null}
      </Card>
    </div>
  );
}
