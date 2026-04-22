import Link from "next/link";

import { Card } from "@/components/shared/card";
import { PageHeader } from "@/components/shared/page-header";
import { SectionBlock } from "@/components/shared/section-block";
import { getProgramLessonCount, listVisiblePrograms } from "@/lib/services";

export default async function ProgramasPage() {
  const programs = await listVisiblePrograms();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Usuario"
        title="Mis programas"
        description="Programas visibles para tu cuenta. La restriccion fina por compra se conectara en una fase posterior."
      />
      <SectionBlock title="Disponibles ahora">
        <div className="grid gap-4 lg:grid-cols-2">
          {programs.map((program) => (
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
        {programs.length === 0 ? (
          <Card>
            <p className="text-sm leading-6 text-neutral-600">
              No hay programas publicados todavia.
            </p>
          </Card>
        ) : null}
      </SectionBlock>
    </div>
  );
}
