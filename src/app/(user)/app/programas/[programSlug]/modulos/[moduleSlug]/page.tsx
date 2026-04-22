import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { AccessRequiredCard } from "@/components/app/access-required-card";
import { LessonStatusPill, ProgressMeter } from "@/components/app/progress-meter";
import { Card } from "@/components/shared/card";
import { PageHeader } from "@/components/shared/page-header";
import { SectionBlock } from "@/components/shared/section-block";
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
        <PageHeader
          eyebrow={moduleResult.program.product?.name ?? "Programa"}
          title={moduleResult.program.title}
          description="Tu cuenta no tiene acceso activo para abrir este modulo."
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
      <PageHeader
        eyebrow={moduleResult.program.title}
        title={programModule.title}
        description={programModule.description ?? undefined}
        action={
          nextLesson ? (
            <Link
              href={`/app/programas/${programSlug}/lecciones/${nextLesson.slug}`}
              className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
            >
              {moduleProgress.completedCount > 0 ? "Continuar modulo" : "Empezar modulo"}
            </Link>
          ) : null
        }
      />

      <Card>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
          Objetivo del modulo
        </p>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-700">
          Salir con una decision mas concreta: que promesa trabajar, con quien
          validarla y que pieza preparar para la siguiente conversacion.
        </p>
        <div className="mt-5 max-w-xl">
          <ProgressMeter
            percent={moduleProgress.percent}
            label={`${moduleProgress.completedCount}/${moduleProgress.totalCount} lecciones completadas`}
          />
        </div>
      </Card>

      <SectionBlock title="Lecciones">
        <div className="grid gap-3">
          {programModule.lessons.map((lesson) => (
            <Link
              key={lesson.id}
              href={`/app/programas/${programSlug}/lecciones/${lesson.slug}`}
              className="rounded-lg border border-border bg-surface p-4 shadow-sm shadow-neutral-950/5 transition hover:border-accent"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                    Leccion {lesson.sortOrder}
                  </p>
                  <h2 className="mt-1 text-base font-semibold text-foreground">
                    {lesson.title}
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-neutral-600">
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
      </SectionBlock>

      <Link
        href={`/app/programas/${programSlug}`}
        className="inline-flex rounded-md border border-border bg-surface px-4 py-2 text-sm font-semibold text-foreground"
      >
        Volver al programa
      </Link>
    </div>
  );
}
