import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { AccessRequiredCard } from "@/components/app/access-required-card";
import { LessonStatusPill, ProgressMeter } from "@/components/app/progress-meter";
import { Card } from "@/components/shared/card";
import { PageHeader } from "@/components/shared/page-header";
import { SectionBlock } from "@/components/shared/section-block";
import { auth } from "@/lib/auth";
import {
  getModuleProgress,
  getProgramBySlug,
  getProgramProgress,
} from "@/lib/services";

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
  const progress = await getProgramProgress(user.id, program);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={program.product?.name ?? "Programa"}
        title={program.title}
        description={program.description ?? undefined}
        action={
          progress.nextLesson ? (
            <Link
              href={progress.nextLesson.href}
              className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
            >
              {progress.completedCount > 0 ? "Continuar" : "Empezar"}
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
            Progreso
          </p>
          <div className="mt-3">
            <ProgressMeter
              percent={progress.percent}
              label={`${progress.completedCount}/${progress.totalCount} lecciones`}
            />
          </div>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Siguiente paso
          </p>
          <p className="mt-2 text-sm font-medium text-foreground">
            {progress.nextLesson?.lesson.title ?? "Programa completado"}
          </p>
        </Card>
      </div>

      <SectionBlock
        title="Ruta del programa"
        description="Avanza modulo por modulo. Cada leccion completada queda guardada en tu cuenta."
      >
        <div className="space-y-4">
          {program.modules.map((module) => {
            const moduleProgress = getModuleProgress(
              module,
              progress.completedLessonIds,
            );
            const moduleHref = moduleProgress.nextLesson
              ? `/app/programas/${program.slug}/lecciones/${moduleProgress.nextLesson.slug}`
              : `/app/programas/${program.slug}/modulos/${module.slug}`;

            return (
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
                    <div className="mt-4 max-w-md">
                      <ProgressMeter
                        percent={moduleProgress.percent}
                        label={`${moduleProgress.completedCount}/${moduleProgress.totalCount} completadas`}
                      />
                    </div>
                  </div>
                  <Link
                    href={moduleHref}
                    className="rounded-md border border-border bg-surface px-4 py-2 text-sm font-semibold text-foreground"
                  >
                    {moduleProgress.completedCount > 0
                      ? "Continuar modulo"
                      : "Abrir modulo"}
                  </Link>
                </div>
                <div className="mt-5 grid gap-2">
                  {module.lessons.map((lesson) => (
                    <Link
                      key={lesson.id}
                      href={`/app/programas/${program.slug}/lecciones/${lesson.slug}`}
                      className="rounded-md border border-border bg-background px-4 py-3 text-sm font-medium text-neutral-700 transition hover:border-accent hover:text-foreground"
                    >
                      <span className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <span>
                          {lesson.sortOrder}. {lesson.title}
                        </span>
                        <LessonStatusPill
                          isCompleted={progress.completedLessonIds.has(lesson.id)}
                        />
                      </span>
                    </Link>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </SectionBlock>
    </div>
  );
}
