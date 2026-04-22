import Link from "next/link";

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

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Contenido
          </p>
          <p className="mt-2 text-sm leading-6 text-neutral-600">
            Revisa programas, modulos y lecciones antes de publicar.
          </p>
          <Link
            href="/admin/programas"
            className="mt-4 inline-flex rounded-md border border-border px-3 py-2 text-sm font-semibold text-foreground"
          >
            Gestionar contenido
          </Link>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Accesos
          </p>
          <p className="mt-2 text-sm leading-6 text-neutral-600">
            Activa, desactiva o corrige accesos cuando Stripe o soporte lo pidan.
          </p>
          <Link
            href="/admin/accesos"
            className="mt-4 inline-flex rounded-md border border-border px-3 py-2 text-sm font-semibold text-foreground"
          >
            Gestionar accesos
          </Link>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Salida controlada
          </p>
          <p className="mt-2 text-sm leading-6 text-neutral-600">
            Antes de invitar usuarios, confirma seed, price de Stripe, webhook y
            contenido publicado.
          </p>
        </Card>
      </div>
    </div>
  );
}
