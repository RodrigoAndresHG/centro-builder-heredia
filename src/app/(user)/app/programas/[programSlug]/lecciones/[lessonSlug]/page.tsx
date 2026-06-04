import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { AccessRequiredCard } from "@/components/app/access-required-card";
import { CopyButton } from "@/components/app/copy-button";
import { MarkdownContent } from "@/components/app/markdown-content";
import { LessonStatusPill, ProgressMeter } from "@/components/app/progress-meter";
import {
  WorkspaceCard,
  WorkspaceHero,
  WorkspaceTrail,
} from "@/components/app/workspace-card";
import { completeLesson } from "@/lib/actions/progress";
import { auth } from "@/lib/auth";
import {
  getCloudflareStreamPlaybackUrl,
  getLessonBySlug,
  getLessonExtras,
  getProgramProgress,
  isLessonCompleted,
} from "@/lib/services";

type LessonPageProps = {
  params: Promise<{ programSlug: string; lessonSlug: string }>;
};

const resourceTypeMeta: Record<
  string,
  { label: string; icon: string }
> = {
  LINK: { label: "Link externo", icon: "↗" },
  DOWNLOAD: { label: "Descarga", icon: "⬇" },
  REFERENCE: { label: "Referencia", icon: "📖" },
};

function safeHostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { programSlug, lessonSlug } = await params;
  const session = await auth();
  const user = session?.user;

  if (!user) {
    redirect(
      `/login?callbackUrl=/app/programas/${programSlug}/lecciones/${lessonSlug}`,
    );
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
        <WorkspaceTrail
          items={[
            { label: "Workspace", href: "/app" },
            {
              label: lessonData.program.title,
              href: `/app/programas/${programSlug}`,
            },
            { label: "Lección bloqueada" },
          ]}
        />

        <WorkspaceHero
          eyebrow={lessonData.program.product?.name ?? "Programa"}
          title={lessonData.program.title}
          description="Tu cuenta no tiene acceso activo para abrir esta lección."
        />
        <AccessRequiredCard
          title={lessonData.program.title}
          productSlug={lessonData.program.product?.slug}
        />
      </div>
    );
  }

  if (!lessonData.lesson) {
    notFound();
  }

  const { program, lesson, previousLesson, nextLesson } = lessonData;
  const isPresale = program.status === "PRESALE";
  const canConsumeLesson = program.status === "OPEN" || lesson.isPreview;
  const [programProgress, completed, extras] = await Promise.all([
    getProgramProgress(user.id, program),
    isLessonCompleted(user.id, lesson.id),
    getLessonExtras(lesson.id),
  ]);
  const { prompts, resources } = extras;
  const nextHref = nextLesson
    ? `/app/programas/${program.slug}/lecciones/${nextLesson.slug}`
    : undefined;

  return (
    <div className="space-y-8">
      <WorkspaceTrail
        items={[
          { label: "Workspace", href: "/app" },
          {
            label: program.title,
            href: `/app/programas/${program.slug}`,
          },
          {
            label: lesson.moduleTitle,
            href: `/app/programas/${program.slug}/modulos/${lesson.moduleSlug}`,
          },
          { label: lesson.title },
        ]}
      />

      <WorkspaceHero
        eyebrow={`${program.title} · ${lesson.moduleTitle}`}
        title={lesson.title}
        description={lesson.description ?? undefined}
        action={
          <Link
            href={`/app/programas/${program.slug}`}
            className="rounded-md border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-neutral-500"
          >
            Ver programa
          </Link>
        }
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                Estado
              </p>
              <LessonStatusPill isCompleted={completed} />
            </div>
          </div>
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5 md:col-span-2">
            <ProgressMeter
              percent={programProgress.percent}
              label={`${programProgress.completedCount}/${programProgress.totalCount} del programa`}
            />
          </div>
        </div>
      </WorkspaceHero>

      {isPresale && !canConsumeLesson ? (
        <WorkspaceHero
          eyebrow="Preventa activa"
          title="Esta lección se abrirá con el recorrido completo"
          description="Tu acceso fundador ya está confirmado. Esta pieza forma parte del recorrido completo y estará disponible en la apertura oficial."
          action={
            <Link
              href={`/app/programas/${program.slug}`}
              className="rounded-md border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-neutral-500"
            >
              Volver al mapa
            </Link>
          }
        >
          <div className="rounded-2xl border border-teal-400/20 bg-teal-400/10 p-5">
            <p className="text-sm font-semibold text-teal-100">
              Ya estás dentro antes que el público general. El contenido
              completo se habilitará según la fecha oficial del programa.
            </p>
          </div>
        </WorkspaceHero>
      ) : null}

      {canConsumeLesson ? (
        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          <div className="min-w-0 space-y-6">
            <div className="aspect-video overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-950 text-white shadow-2xl shadow-black/30">
              {lesson.streamVideoId ? (
                <iframe
                  src={getCloudflareStreamPlaybackUrl(lesson.streamVideoId)}
                  title={lesson.videoTitle ?? lesson.title}
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                  allowFullScreen
                  className="h-full w-full"
                />
              ) : lesson.videoUrl ? (
                <div className="flex h-full flex-col justify-between p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-300">
                    Video
                  </p>
                  <a
                    href={lesson.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-white underline underline-offset-4"
                  >
                    Abrir video de la lección
                  </a>
                </div>
              ) : (
                <div className="flex h-full flex-col justify-between p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-300">
                    Contenido del build
                  </p>
                  <div>
                    <p className="text-2xl font-semibold text-white">
                      Lección enfocada del build
                    </p>
                    <p className="mt-3 max-w-xl text-sm leading-7 text-neutral-300">
                      Esta pieza forma parte de la ruta guiada. Consume el
                      contenido, marca progreso y sigue al próximo paso.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <WorkspaceCard className="p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-300">
                Contenido de la lección
              </p>
              <div className="mt-5">
                <MarkdownContent
                  content={lesson.content ?? "Contenido en preparación."}
                />
              </div>
            </WorkspaceCard>

            {prompts.length > 0 ? (
              <WorkspaceCard className="p-7">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-300">
                      Prompts
                    </p>
                    <p className="mt-1 text-sm text-neutral-400">
                      Copia y pega estos prompts directamente en tu herramienta
                      favorita.
                    </p>
                  </div>
                  <span className="rounded-full border border-neutral-700 bg-neutral-950 px-2.5 py-1 text-xs font-semibold text-neutral-300">
                    {prompts.length}
                  </span>
                </div>

                <div className="mt-5 space-y-4">
                  {prompts.map((prompt) => (
                    <div
                      key={prompt.id}
                      className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950"
                    >
                      <div className="flex items-start justify-between gap-3 border-b border-neutral-800 px-4 py-3">
                        <p className="min-w-0 break-words text-sm font-semibold text-white">
                          {prompt.title}
                        </p>
                        <CopyButton value={prompt.body} />
                      </div>
                      <pre className="whitespace-pre-wrap break-words px-4 py-4 font-mono text-sm leading-6 text-neutral-200 [overflow-wrap:anywhere]">
                        {prompt.body}
                      </pre>
                    </div>
                  ))}
                </div>
              </WorkspaceCard>
            ) : null}

            {resources.length > 0 ? (
              <WorkspaceCard className="p-7">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-300">
                      Recursos
                    </p>
                    <p className="mt-1 text-sm text-neutral-400">
                      Material complementario para profundizar y trabajar fuera
                      de la lección.
                    </p>
                  </div>
                  <span className="rounded-full border border-neutral-700 bg-neutral-950 px-2.5 py-1 text-xs font-semibold text-neutral-300">
                    {resources.length}
                  </span>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {resources.map((resource) => {
                    const meta =
                      resourceTypeMeta[resource.type] ?? resourceTypeMeta.LINK;
                    return (
                      <a
                        key={resource.id}
                        href={resource.url}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex min-w-0 flex-col rounded-xl border border-neutral-800 bg-neutral-950 p-4 transition hover:-translate-y-0.5 hover:border-neutral-600"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
                            <span aria-hidden className="mr-1">
                              {meta.icon}
                            </span>
                            {meta.label}
                          </span>
                        </div>
                        <p className="mt-2 break-words text-sm font-semibold text-white transition group-hover:text-teal-200">
                          {resource.title}
                        </p>
                        {resource.description ? (
                          <p className="mt-1 break-words text-xs leading-5 text-neutral-400">
                            {resource.description}
                          </p>
                        ) : null}
                        <p className="mt-3 break-words text-xs text-teal-300">
                          {safeHostname(resource.url)}
                        </p>
                      </a>
                    );
                  })}
                </div>
              </WorkspaceCard>
            ) : null}
          </div>

          <aside className="min-w-0 space-y-4">
            <WorkspaceCard>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                Acción de progreso
              </p>
              {completed ? (
                <p className="mt-3 text-sm leading-7 text-neutral-300">
                  Esta lección ya está marcada como completada.
                </p>
              ) : (
                <form
                  action={completeLesson.bind(
                    null,
                    program.slug,
                    lesson.slug,
                    nextHref,
                  )}
                  className="mt-4"
                >
                  <button
                    type="submit"
                    className="w-full rounded-md bg-teal-300 px-4 py-2 text-sm font-semibold text-neutral-950 shadow-lg shadow-teal-950/40 transition hover:bg-teal-200"
                  >
                    {nextHref ? "Completar y seguir" : "Marcar completada"}
                  </button>
                </form>
              )}
            </WorkspaceCard>

            <WorkspaceCard>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                Módulo
              </p>
              <p className="mt-2 text-base font-semibold text-white">
                {lesson.moduleTitle}
              </p>
              <Link
                href={`/app/programas/${program.slug}/modulos/${lesson.moduleSlug}`}
                className="mt-4 inline-flex rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm font-semibold text-white transition hover:border-neutral-500"
              >
                Ver módulo
              </Link>
            </WorkspaceCard>

            <WorkspaceCard>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                Navegación
              </p>
              <div className="mt-4 space-y-3">
                {previousLesson ? (
                  <Link
                    href={`/app/programas/${program.slug}/lecciones/${previousLesson.slug}`}
                    className="block rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm font-medium text-neutral-200 transition hover:border-neutral-600"
                  >
                    Anterior: {previousLesson.title}
                  </Link>
                ) : (
                  <p className="rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-500">
                    Primera lección del programa
                  </p>
                )}

                {nextLesson ? (
                  <Link
                    href={`/app/programas/${program.slug}/lecciones/${nextLesson.slug}`}
                    className="block rounded-md bg-teal-300 px-3 py-2 text-sm font-semibold text-neutral-950 transition hover:bg-teal-200"
                  >
                    Siguiente: {nextLesson.title}
                  </Link>
                ) : (
                  <p className="rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-500">
                    Última lección del programa
                  </p>
                )}
              </div>
            </WorkspaceCard>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
