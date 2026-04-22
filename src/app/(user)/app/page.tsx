import Link from "next/link";
import { redirect } from "next/navigation";

import { AccessRequiredCard } from "@/components/app/access-required-card";
import { Card } from "@/components/shared/card";
import { PageHeader } from "@/components/shared/page-header";
import { SignOutButton } from "@/components/shared/sign-out-button";
import { auth } from "@/lib/auth";
import { getProgramLessonCount, listProgramsForViewer } from "@/lib/services";

export default async function UserDashboardPage() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    redirect("/login?callbackUrl=/app");
  }

  const { availablePrograms, lockedPrograms } = await listProgramsForViewer({
    id: user.id,
    role: user.role,
  });
  const program = availablePrograms[0] ?? null;
  const lockedProgram = lockedPrograms[0] ?? null;
  const lessonCount = getProgramLessonCount(program);
  const firstModule = program?.modules[0] ?? null;
  const firstLesson = firstModule?.lessons[0] ?? null;
  const continueHref = firstLesson
    ? `/app/programas/${program.slug}/lecciones/${firstLesson.slug}`
    : program
      ? `/app/programas/${program.slug}`
      : "/app/programas";

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Usuario"
        title={`Hola${user?.name ? `, ${user.name}` : ""}`}
        description="Tu espacio privado para convertir ideas en ofertas claras y vendibles."
        action={<SignOutButton />}
      />

      {program ? (
        <Card className="p-0">
          <div className="grid gap-0 lg:grid-cols-[1.4fr_0.8fr]">
            <div className="space-y-5 p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                  Programa activo
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-foreground">
                  {program.title}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">
                  {program.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={continueHref}
                  className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
                >
                  Continuar
                </Link>
                <Link
                  href={`/app/programas/${program.slug}`}
                  className="rounded-md border border-border bg-surface px-4 py-2 text-sm font-semibold text-foreground"
                >
                  Ver programa
                </Link>
              </div>
            </div>
            <div className="border-t border-border bg-surface-muted p-6 lg:border-l lg:border-t-0">
              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                    Acceso
                  </p>
                  <p className="mt-2 text-sm font-medium text-foreground">
                    Acceso activo
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                    Modulos
                  </p>
                  <p className="mt-2 text-sm font-medium text-foreground">
                    {program.modules.length} publicados
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                    Lecciones
                  </p>
                  <p className="mt-2 text-sm font-medium text-foreground">
                    {lessonCount} disponibles
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ) : lockedProgram ? (
        <AccessRequiredCard
          title={lockedProgram.title}
          description="Tu cuenta no tiene acceso activo a este producto todavia. Cuando el acceso este habilitado, el programa aparecera como disponible."
          productSlug={lockedProgram.product?.slug}
        />
      ) : (
        <Card>
          <p className="text-sm leading-6 text-neutral-600">
            Todavia no hay programas publicados. Ejecuta el seed para cargar la
            vertical slice inicial.
          </p>
        </Card>
      )}

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
