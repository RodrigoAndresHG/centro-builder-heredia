import { Card } from "@/components/shared/card";
import { PageHeader } from "@/components/shared/page-header";
import { SignOutButton } from "@/components/shared/sign-out-button";
import { auth } from "@/lib/auth";

export default async function UserDashboardPage() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Usuario"
        title="Dashboard"
        description="Sesion activa y base privada lista para conectar programas."
        action={<SignOutButton />}
      />
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Nombre
          </p>
          <p className="mt-2 text-sm font-medium text-foreground">
            {user?.name ?? "Sin nombre registrado"}
          </p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Correo
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
            {user?.role ?? "INVITADO"}
          </p>
        </Card>
      </div>
    </div>
  );
}
