import Link from "next/link";
import { redirect } from "next/navigation";

import { AccessRequiredCard } from "@/components/app/access-required-card";
import { ProgressMeter } from "@/components/app/progress-meter";
import { WorkspaceCard, WorkspaceHero } from "@/components/app/workspace-card";
import { auth } from "@/lib/auth";
import {
  getProgramLessonCount,
  getProgramProgress,
  listProgramsForViewer,
} from "@/lib/services";

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
  const programsWithProgress = await Promise.all(
    availablePrograms.map(async (program) => ({
      program,
      progress: await getProgramProgress(user.id, program),
    })),
  );

  return (
    <div className="space-y-8">
      <WorkspaceHero
        eyebrow="Programas"
        title="Tu mapa privado de construcción."
        description="Programas disponibles, continuidad recomendada y contenido premium que puedes activar cuando estés listo."
      />

      <section className="space-y-5">
        <div>
          <h2 className="text-2xl font-semibold text-white">Disponibles ahora</h2>
          <p className="mt-2 text-sm leading-7 text-neutral-400">
            Rutas habilitadas según tus permisos activos.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {programsWithProgress.map(({ program, progress }) => (
            <WorkspaceCard
              key={program.id}
              className="flex flex-col justify-between gap-6 border-teal-400/20 bg-teal-400/10"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-300">
                  {program.product?.name ?? "Programa"}
                </p>
                <h3 className="mt-3 text-2xl font-semibold text-white">
                  {program.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-neutral-300">
                  {program.description}
                </p>
                <div className="mt-6">
                  <ProgressMeter
                    percent={progress.percent}
                    label={`${progress.completedCount}/${progress.totalCount} lecciones`}
                  />
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="text-sm text-neutral-400">
                  {program.modules.length} módulos ·{" "}
                  {getProgramLessonCount(program)} lecciones
                </div>
                <Link
                  href={progress.nextLesson?.href ?? `/app/programas/${program.slug}`}
                  className="rounded-md bg-teal-300 px-4 py-2 text-sm font-semibold text-neutral-950 shadow-lg shadow-teal-950/40 transition hover:bg-teal-200"
                >
                  {progress.completedCount > 0 ? "Continuar" : "Abrir programa"}
                </Link>
              </div>
            </WorkspaceCard>
          ))}
        </div>

        {availablePrograms.length === 0 ? (
          <WorkspaceCard>
            <p className="text-sm leading-7 text-neutral-300">
              No tienes programas disponibles todavía. Si ves un producto bloqueado,
              puedes activar acceso desde esta misma pantalla.
            </p>
          </WorkspaceCard>
        ) : null}
      </section>

      {lockedPrograms.length > 0 ? (
        <section className="space-y-5">
          <div>
            <h2 className="text-2xl font-semibold text-white">Requieren acceso</h2>
            <p className="mt-2 text-sm leading-7 text-neutral-400">
              Productos publicados que puedes activar para entrar al contenido.
            </p>
          </div>
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
        </section>
      ) : null}
    </div>
  );
}
