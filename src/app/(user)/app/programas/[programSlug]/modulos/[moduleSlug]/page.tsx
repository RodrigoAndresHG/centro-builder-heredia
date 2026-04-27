import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { AccessRequiredCard } from "@/components/app/access-required-card";
import { LessonStatusPill, ProgressMeter } from "@/components/app/progress-meter";
import {
  WorkspaceCard,
  WorkspaceHero,
  WorkspaceTrail,
} from "@/components/app/workspace-card";
import { auth } from "@/lib/auth";
import {
  getModuleBySlug,
  getModuleProgress,
  getProgramProgress,
} from "@/lib/services";

type ModulePageProps = {
  params: Promise<{ programSlug: string; moduleSlug: string }>;
};

export default async function ModulePage({ params }: ModulePageProps) {
  const { programSlug, moduleSlug } = await params;
  const session = await auth();
  const user = session?.user;

  if (!user) {
    redirect(`/login?callbackUrl=/app/programas/${programSlug}/modulos/${moduleSlug}`);
  }

  const moduleResult = await getModuleBySlug(programSlug, moduleSlug, {
    id: user.id,
    role: user.role,
  });

  if (moduleResult.access === "not-found") {
    notFound();
  }

  if (moduleResult.access === "locked" && moduleResult.program) {
    return (
      <div className="space-y-8">
        <WorkspaceTrail
          items={[
            { label: "Workspace", href: "/app" },
            {
              label: moduleResult.program.title,
              href: `/app/programas/${programSlug}`,
            },
            { label: "Módulo bloqueado" },
          ]}
        />

        <WorkspaceHero
          eyebrow={moduleResult.program.product?.name ?? "Programa"}
          title={moduleResult.program.title}
          description="Tu cuenta no tiene acceso activo para abrir este módulo."
        />
        <AccessRequiredCard
          title={moduleResult.program.title}
          productSlug={moduleResult.program.product?.slug}
        />
      </div>
    );
  }

  if (!moduleResult.module) {
    notFound();
  }

  const programModule = moduleResult.module;
  const programProgress = await getProgramProgress(user.id, moduleResult.program);
  const moduleProgress = getModuleProgress(
    programModule,
    programProgress.completedLessonIds,
  );
  const nextLesson = moduleProgress.nextLesson;

  return (
    <div className="space-y-8">
      <WorkspaceTrail
        items={[
          { label: "Workspace", href: "/app" },
          {
            label: moduleResult.program.title,
            href: `/app/programas/${programSlug}`,
          },
          { label: programModule.title },
        ]}
      />

      <WorkspaceHero
        eyebrow={moduleResult.program.title}
        title={programModule.title}
        description={programModule.description ?? undefined}
        action={
          nextLesson ? (
            <Link
              href={`/app/programas/${programSlug}/lecciones/${nextLesson.slug}`}
              className="rounded-md bg-teal-300 px-4 py-2 text-sm font-semibold text-neutral-950 shadow-lg shadow-teal-950/40 transition hover:bg-teal-200"
            >
              {moduleProgress.completedCount > 0 ? "Continuar módulo" : "Empezar módulo"}
            </Link>
          ) : null
        }
      >
        <div className="grid gap-4 md:grid-cols-[1fr_1.2fr]">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
              Dirección del módulo
            </p>
            <p className="mt-3 text-sm leading-7 text-neutral-300">
              Avanza en orden, completa cada pieza y conserva el contexto del
              recorrido antes de pasar al siguiente módulo.
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
            <ProgressMeter
              percent={moduleProgress.percent}
              label={`${moduleProgress.completedCount}/${moduleProgress.totalCount} lecciones completadas`}
            />
          </div>
        </div>
      </WorkspaceHero>

      <section className="space-y-5">
        <div>
          <h2 className="text-2xl font-semibold text-white">
            Lecciones del módulo
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-neutral-400">
            Consume cada pieza en orden y marca progreso cuando termines.
          </p>
        </div>

        <div className="grid gap-3">
          {programModule.lessons.map((lesson) => (
            <Link
              key={lesson.id}
              href={`/app/programas/${programSlug}/lecciones/${lesson.slug}`}
              className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5 shadow-xl shadow-black/10 transition hover:-translate-y-1 hover:border-teal-400/50"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-300">
                    Lección {lesson.sortOrder}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-white">
                    {lesson.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-400">
                    {lesson.description}
                  </p>
                </div>
                <LessonStatusPill
                  isCompleted={programProgress.completedLessonIds.has(lesson.id)}
                />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <WorkspaceCard className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-white">Mapa completo</p>
          <p className="mt-1 text-sm text-neutral-400">
            Vuelve al programa para ver el recorrido completo.
          </p>
        </div>
        <Link
          href={`/app/programas/${programSlug}`}
          className="inline-flex rounded-md border border-neutral-700 bg-neutral-950 px-4 py-2 text-sm font-semibold text-white transition hover:border-neutral-500"
        >
          Volver al programa
        </Link>
      </WorkspaceCard>
    </div>
  );
}
