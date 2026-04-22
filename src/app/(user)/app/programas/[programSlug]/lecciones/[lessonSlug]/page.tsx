import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { AccessRequiredCard } from "@/components/app/access-required-card";
import { Card } from "@/components/shared/card";
import { PageHeader } from "@/components/shared/page-header";
import { auth } from "@/lib/auth";
import { getLessonBySlug } from "@/lib/services";

type LessonPageProps = {
  params: Promise<{ programSlug: string; lessonSlug: string }>;
};

export default async function LessonPage({ params }: LessonPageProps) {
  const { programSlug, lessonSlug } = await params;
  const session = await auth();
  const user = session?.user;

  if (!user) {
    redirect(`/login?callbackUrl=/app/programas/${programSlug}/lecciones/${lessonSlug}`);
  }

  const lessonData = await getLessonBySlug(programSlug, lessonSlug, {
    id: user.id,
    role: user.role,
  });

  if (lessonData.access === "not-found") {
    notFound();
  }

  if (lessonData.access === "locked" && lessonData.program) {
    return (
      <div className="space-y-8">
        <PageHeader
          eyebrow={lessonData.program.product?.name ?? "Programa"}
          title={lessonData.program.title}
          description="Tu cuenta no tiene acceso activo para abrir esta leccion."
        />
        <AccessRequiredCard title={lessonData.program.title} />
      </div>
    );
  }

  if (!lessonData.lesson) {
    notFound();
  }

  const { program, lesson, previousLesson, nextLesson } = lessonData;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={`${program.title} · ${lesson.moduleTitle}`}
        title={lesson.title}
        description={lesson.description ?? undefined}
        action={
          <Link
            href={`/app/programas/${program.slug}`}
            className="rounded-md border border-border bg-surface px-4 py-2 text-sm font-semibold text-foreground"
          >
            Ver programa
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.6fr]">
        <div className="space-y-6">
          <div className="aspect-video rounded-lg border border-border bg-neutral-950 p-6 text-accent-foreground shadow-sm shadow-neutral-950/10">
            {lesson.videoUrl ? (
              <div className="flex h-full flex-col justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-300">
                  Video
                </p>
                <a
                  href={lesson.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-semibold text-white underline underline-offset-4"
                >
                  Abrir video de la leccion
                </a>
              </div>
            ) : (
              <div className="flex h-full flex-col justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-300">
                  Video pendiente
                </p>
                <div>
                  <p className="text-2xl font-semibold text-white">
                    Contenido base disponible
                  </p>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-300">
                    Esta leccion ya puede consumirse en texto. El video se
                    conectara cuando el activo este listo.
                  </p>
                </div>
              </div>
            )}
          </div>

          <Card>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
              Nota de trabajo
            </p>
            <div className="mt-4 space-y-4 text-base leading-8 text-neutral-700">
              {(lesson.content ?? "Contenido en preparacion.")
                .split("\n")
                .map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
            </div>
          </Card>
        </div>

        <aside className="space-y-4">
          <Card>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
              Modulo
            </p>
            <p className="mt-2 text-sm font-semibold text-foreground">
              {lesson.moduleTitle}
            </p>
            <Link
              href={`/app/programas/${program.slug}/modulos/${lesson.moduleSlug}`}
              className="mt-4 inline-flex rounded-md border border-border bg-surface px-3 py-2 text-sm font-semibold text-foreground"
            >
              Ver modulo
            </Link>
          </Card>

          <Card>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
              Navegacion
            </p>
            <div className="mt-4 space-y-3">
              {previousLesson ? (
                <Link
                  href={`/app/programas/${program.slug}/lecciones/${previousLesson.slug}`}
                  className="block rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground"
                >
                  Anterior: {previousLesson.title}
                </Link>
              ) : (
                <p className="rounded-md border border-border bg-background px-3 py-2 text-sm text-neutral-500">
                  Primera leccion del programa
                </p>
              )}

              {nextLesson ? (
                <Link
                  href={`/app/programas/${program.slug}/lecciones/${nextLesson.slug}`}
                  className="block rounded-md bg-accent px-3 py-2 text-sm font-semibold text-accent-foreground"
                >
                  Siguiente: {nextLesson.title}
                </Link>
              ) : (
                <p className="rounded-md border border-border bg-background px-3 py-2 text-sm text-neutral-500">
                  Ultima leccion del programa
                </p>
              )}
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
