import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { AccessRequiredCard } from "@/components/app/access-required-card";
import { Card } from "@/components/shared/card";
import { PageHeader } from "@/components/shared/page-header";
import { SectionBlock } from "@/components/shared/section-block";
import { auth } from "@/lib/auth";
import { getProgramBySlug, getProgramLessonCount } from "@/lib/services";

type ProgramPageProps = {
  params: Promise<{ programSlug: string }>;
};

export default async function ProgramPage({ params }: ProgramPageProps) {
  const { programSlug } = await params;
  const session = await auth();
  const user = session?.user;

  if (!user) {
    redirect(`/login?callbackUrl=/app/programas/${programSlug}`);
  }

  const programResult = await getProgramBySlug(programSlug, {
    id: user.id,
    role: user.role,
  });

  if (programResult.access === "not-found" || !programResult.program) {
    notFound();
  }

  if (programResult.access === "locked") {
    return (
      <div className="space-y-8">
        <PageHeader
          eyebrow={programResult.program.product?.name ?? "Programa"}
          title={programResult.program.title}
          description="Este programa existe, pero tu cuenta no tiene acceso activo para abrirlo."
        />
        <AccessRequiredCard
          title={programResult.program.title}
          productSlug={programResult.program.product?.slug}
        />
      </div>
    );
  }

  const program = programResult.program;
  const firstModule = program.modules[0] ?? null;
  const firstLesson = firstModule?.lessons[0] ?? null;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={program.product?.name ?? "Programa"}
        title={program.title}
        description={program.description ?? undefined}
        action={
          firstLesson ? (
            <Link
              href={`/app/programas/${program.slug}/lecciones/${firstLesson.slug}`}
              className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
            >
              Continuar
            </Link>
          ) : null
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Enfoque
          </p>
          <p className="mt-2 text-sm leading-6 text-foreground">
            Convertir una idea en una oferta inicial clara, conversable y vendible.
          </p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Modulos
          </p>
          <p className="mt-2 text-sm font-medium text-foreground">
            {program.modules.length} publicados
          </p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Lecciones
          </p>
          <p className="mt-2 text-sm font-medium text-foreground">
            {getProgramLessonCount(program)} disponibles
          </p>
        </Card>
      </div>

      <SectionBlock
        title="Ruta del programa"
        description="Avanza modulo por modulo. El progreso real se conectara mas adelante."
      >
        <div className="space-y-4">
          {program.modules.map((module) => (
            <Card key={module.id}>
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-2xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                    Modulo {module.sortOrder}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-foreground">
                    {module.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">
                    {module.description}
                  </p>
                </div>
                <Link
                  href={`/app/programas/${program.slug}/modulos/${module.slug}`}
                  className="rounded-md border border-border bg-surface px-4 py-2 text-sm font-semibold text-foreground"
                >
                  Abrir modulo
                </Link>
              </div>
              <div className="mt-5 grid gap-2">
                {module.lessons.map((lesson) => (
                  <Link
                    key={lesson.id}
                    href={`/app/programas/${program.slug}/lecciones/${lesson.slug}`}
                    className="rounded-md border border-border bg-background px-4 py-3 text-sm font-medium text-neutral-700 transition hover:border-accent hover:text-foreground"
                  >
                    {lesson.sortOrder}. {lesson.title}
                  </Link>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </SectionBlock>
    </div>
  );
}
