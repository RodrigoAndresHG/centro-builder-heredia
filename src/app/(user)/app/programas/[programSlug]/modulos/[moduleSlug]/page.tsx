import Link from "next/link";
import { notFound } from "next/navigation";

import { Card } from "@/components/shared/card";
import { PageHeader } from "@/components/shared/page-header";
import { SectionBlock } from "@/components/shared/section-block";
import { getModuleBySlug } from "@/lib/services";

type ModulePageProps = {
  params: Promise<{ programSlug: string; moduleSlug: string }>;
};

export default async function ModulePage({ params }: ModulePageProps) {
  const { programSlug, moduleSlug } = await params;
  const programModule = await getModuleBySlug(programSlug, moduleSlug);

  if (!programModule) {
    notFound();
  }

  const firstLesson = programModule.lessons[0] ?? null;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={programModule.program.title}
        title={programModule.title}
        description={programModule.description ?? undefined}
        action={
          firstLesson ? (
            <Link
              href={`/app/programas/${programSlug}/lecciones/${firstLesson.slug}`}
              className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
            >
              Empezar modulo
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
                <span className="text-sm font-semibold text-foreground">
                  Abrir
                </span>
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
