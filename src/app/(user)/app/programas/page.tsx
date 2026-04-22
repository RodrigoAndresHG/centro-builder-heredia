import Link from "next/link";
import { redirect } from "next/navigation";

import { AccessRequiredCard } from "@/components/app/access-required-card";
import { Card } from "@/components/shared/card";
import { PageHeader } from "@/components/shared/page-header";
import { SectionBlock } from "@/components/shared/section-block";
import { auth } from "@/lib/auth";
import { getProgramLessonCount, listProgramsForViewer } from "@/lib/services";

export default async function ProgramasPage() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    redirect("/login?callbackUrl=/app/programas");
  }

  const { availablePrograms, lockedPrograms } = await listProgramsForViewer({
    id: user.id,
    role: user.role,
  });

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Usuario"
        title="Mis programas"
        description="Programas disponibles segun los permisos activos de tu cuenta."
      />
      <SectionBlock title="Disponibles ahora">
        <div className="grid gap-4 lg:grid-cols-2">
          {availablePrograms.map((program) => (
            <Card key={program.id} className="flex flex-col justify-between gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                  {program.product?.name ?? "Programa"}
                </p>
                <h2 className="mt-2 text-xl font-semibold text-foreground">
                  {program.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-neutral-600">
                  {program.description}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="text-sm text-neutral-600">
                  {program.modules.length} modulos ·{" "}
                  {getProgramLessonCount(program)} lecciones
                </div>
                <Link
                  href={`/app/programas/${program.slug}`}
                  className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
                >
                  Abrir programa
                </Link>
              </div>
            </Card>
          ))}
        </div>
        {availablePrograms.length === 0 ? (
          <Card>
            <p className="text-sm leading-6 text-neutral-600">
              No tienes programas disponibles en este momento.
            </p>
          </Card>
        ) : null}
      </SectionBlock>

      {lockedPrograms.length > 0 ? (
        <SectionBlock title="Requieren acceso">
          <div className="grid gap-4 lg:grid-cols-2">
            {lockedPrograms.map((program) => (
              <AccessRequiredCard
                key={program.id}
                compact
                title={program.title}
                description="Programa publicado, pero bloqueado para tu cuenta hasta activar acceso."
                productSlug={program.product?.slug}
              />
            ))}
          </div>
        </SectionBlock>
      ) : null}
    </div>
  );
}
