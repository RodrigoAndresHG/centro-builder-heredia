import { Card } from "@/components/shared/card";
import { PageHeader } from "@/components/shared/page-header";
import { SignOutButton } from "@/components/shared/sign-out-button";
import { auth } from "@/lib/auth";

export default async function AdminDashboardPage() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin"
        title="Dashboard admin"
        description="Acceso administrativo validado por rol ADMIN."
        action={<SignOutButton />}
      />
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Usuario
          </p>
          <p className="mt-2 text-sm font-medium text-foreground">
            {user?.email ?? "Sin correo"}
          </p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Rol
          </p>
          <p className="mt-2 text-sm font-medium text-foreground">
            {user?.role ?? "ADMIN"}
          </p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Estado
          </p>
          <p className="mt-2 text-sm font-medium text-foreground">
            Proteccion inicial activa
          </p>
        </Card>
      </div>
    </div>
  );
}
