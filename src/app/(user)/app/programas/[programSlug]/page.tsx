import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { AccessRequiredCard } from "@/components/app/access-required-card";
import { PresaleCountdown } from "@/components/app/presale-countdown";
import { LessonStatusPill, ProgressMeter } from "@/components/app/progress-meter";
import {
  WorkspaceCard,
  WorkspaceHero,
  WorkspaceMetric,
  WorkspaceTrail,
} from "@/components/app/workspace-card";
import { auth } from "@/lib/auth";
import {
  getModuleProgress,
  getProgramBySlug,
  getProgramProgress,
} from "@/lib/services";

type ProgramPageProps = {
  params: Promise<{ programSlug: string }>;
};

function formatOpenDate(date: Date | null) {
  if (!date) {
    return "Fecha por confirmar";
  }

  return new Intl.DateTimeFormat("es", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(date);
}

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
        <WorkspaceTrail
          items={[
            { label: "Workspace", href: "/app" },
            { label: "Programas", href: "/app/programas" },
            { label: programResult.program.title },
          ]}
        />

        <WorkspaceHero
          eyebrow={programResult.program.product?.name ?? "Programa"}
          title={programResult.program.title}
          description="Este programa existe, pero tu cuenta todavía no tiene acceso activo para abrirlo."
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
  const isPresale = program.status === "PRESALE";
  const canConsumeLessons = program.status === "OPEN";

  return (
    <div className="space-y-8">
      <WorkspaceTrail
        items={[
          { label: "Workspace", href: "/app" },
          { label: "Programas", href: "/app/programas" },
          { label: program.title },
        ]}
      />

      {isPresale ? (
        <WorkspaceHero
          eyebrow="Preventa activa"
          title="Ya estás dentro de la preventa"
          description={
            program.presaleMessage ??
            "Tu acceso fundador ya quedó activo. El recorrido completo se abrirá oficialmente el 16 de mayo de 2026. Hasta entonces, estás entrando antes que el público general."
          }
        >
          <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-2xl border border-teal-400/20 bg-teal-400/10 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-300">
                Apertura oficial del recorrido completo en:
              </p>
              <p className="mt-3 text-2xl font-semibold text-white">
                {formatOpenDate(program.opensAt)}
              </p>
            </div>
            {program.opensAt ? (
              <PresaleCountdown opensAt={program.opensAt.toISOString()} />
            ) : (
              <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
                <p className="text-sm font-semibold text-neutral-300">
                  El cronómetro aparecerá cuando definas la fecha oficial de
                  apertura desde admin.
                </p>
              </div>
            )}
          </div>
        </WorkspaceHero>
      ) : null}

      <WorkspaceHero
        eyebrow={program.product?.name ?? "Programa"}
        title={program.title}
        description={program.description ?? undefined}
        action={
          canConsumeLessons && progress.nextLesson ? (
            <Link
              href={progress.nextLesson.href}
              className="rounded-md bg-teal-300 px-4 py-2 text-sm font-semibold text-neutral-950 shadow-lg shadow-teal-950/40 transition hover:bg-teal-200"
            >
              {progress.completedCount > 0 ? "Continuar" : "Empezar"}
            </Link>
          ) : null
        }
      >
        <div className="grid gap-4 md:grid-cols-3">
          <WorkspaceMetric
            label="Estado"
            value={isPresale ? "Preventa" : "Acceso activo"}
            detail={
              isPresale
                ? "Tu acceso fundador está confirmado antes de la apertura."
                : "Tu cuenta puede recorrer este programa."
            }
          />
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
            <ProgressMeter
              percent={progress.percent}
              label={`${progress.completedCount}/${progress.totalCount} lecciones`}
            />
          </div>
          <WorkspaceMetric
            label="Siguiente paso"
            value={
              isPresale
                ? "Esperar apertura oficial"
                : (progress.nextLesson?.lesson.title ?? "Programa completado")
            }
          />
        </div>
      </WorkspaceHero>

      <section className="space-y-5">
        <div>
          <h2 className="text-2xl font-semibold text-white">Mapa del programa</h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-neutral-400">
            Recorre los módulos como una ruta guiada. Cada lección completada
            queda guardada en tu cuenta y mantiene la continuidad del build.
          </p>
        </div>

        <div className="space-y-4">
          {program.modules.map((module) => {
            const moduleProgress = getModuleProgress(
              module,
              progress.completedLessonIds,
            );
            const previewLesson = module.lessons.find((lesson) => lesson.isPreview);
            const moduleHref = canConsumeLessons && moduleProgress.nextLesson
              ? `/app/programas/${program.slug}/lecciones/${moduleProgress.nextLesson.slug}`
              : previewLesson
                ? `/app/programas/${program.slug}/lecciones/${previewLesson.slug}`
              : `/app/programas/${program.slug}/modulos/${module.slug}`;
            const moduleActionLabel = isPresale
              ? previewLesson
                ? "Ver preview"
                : "Ver módulo"
              : moduleProgress.completedCount > 0
                ? "Continuar módulo"
                : "Abrir módulo";

            return (
              <WorkspaceCard key={module.id} className="overflow-hidden">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-2xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-300">
                      Módulo {module.sortOrder}
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold text-white">
                      {module.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-neutral-300">
                      {module.description}
                    </p>
                    <div className="mt-5 max-w-md">
                      <ProgressMeter
                        percent={moduleProgress.percent}
                        label={`${moduleProgress.completedCount}/${moduleProgress.totalCount} completadas`}
                      />
                    </div>
                  </div>
                  <Link
                    href={moduleHref}
                    className="rounded-md border border-neutral-700 bg-neutral-950 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-teal-400/50"
                  >
                    {moduleActionLabel}
                  </Link>
                </div>

                <div className="mt-6 grid gap-2">
                  {module.lessons.map((lesson) => {
                    const lessonIsAvailable = canConsumeLessons || lesson.isPreview;

                    return lessonIsAvailable ? (
                      <Link
                        key={lesson.id}
                        href={`/app/programas/${program.slug}/lecciones/${lesson.slug}`}
                        className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm font-medium text-neutral-300 transition hover:-translate-y-0.5 hover:border-teal-400/50 hover:text-white"
                      >
                        <span className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <span>
                            {lesson.sortOrder}. {lesson.title}
                          </span>
                          {lesson.isPreview && isPresale ? (
                            <span className="rounded-full bg-teal-400/10 px-2.5 py-1 text-xs font-semibold text-teal-200">
                              Preview
                            </span>
                          ) : (
                            <LessonStatusPill
                              isCompleted={progress.completedLessonIds.has(
                                lesson.id,
                              )}
                            />
                          )}
                        </span>
                      </Link>
                    ) : (
                      <div
                        key={lesson.id}
                        className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm font-medium text-neutral-500"
                      >
                        <span className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <span>
                            {lesson.sortOrder}. {lesson.title}
                          </span>
                          <span className="rounded-full bg-amber-400/10 px-2.5 py-1 text-xs font-semibold text-amber-200">
                            Disponible en apertura
                          </span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </WorkspaceCard>
            );
          })}
        </div>
      </section>
    </div>
  );
}
