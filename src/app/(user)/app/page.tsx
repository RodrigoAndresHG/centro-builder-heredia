import Link from "next/link";
import { redirect } from "next/navigation";

import { AccessRequiredCard } from "@/components/app/access-required-card";
import { ProgressMeter } from "@/components/app/progress-meter";
import { WorkspaceCard, WorkspaceHero } from "@/components/app/workspace-card";
import { SignOutButton } from "@/components/shared/sign-out-button";
import { auth } from "@/lib/auth";
import {
  getProgramLessonCount,
  getProgramProgress,
  listProgramsForViewer,
} from "@/lib/services";

type UserDashboardPageProps = {
  searchParams: Promise<{ checkout?: string }>;
};

export default async function UserDashboardPage({
  searchParams,
}: UserDashboardPageProps) {
  const { checkout } = await searchParams;
  const session = await auth();
  const user = session?.user;

  if (!user) {
    redirect("/login?callbackUrl=/app");
  }

  const { availablePrograms, lockedPrograms } = await listProgramsForViewer({
    id: user.id,
    role: user.role,
  });
  const program = availablePrograms[0] ?? null;
  const lockedProgram = lockedPrograms[0] ?? null;
  const lessonCount = getProgramLessonCount(program);
  const progress = program ? await getProgramProgress(user.id, program) : null;
  const continueHref = progress?.nextLesson
    ? progress.nextLesson.href
    : program
      ? `/app/programas/${program.slug}`
      : "/app/programas";

  return (
    <div className="space-y-8">
      {checkout === "success" ? (
        <WorkspaceCard className="border-emerald-400/20 bg-emerald-400/10">
          <p className="text-sm font-semibold text-emerald-200">
            Compra recibida. Si Stripe ya confirmo el pago, tu acceso queda activo
            automaticamente; si no lo ves, revisa soporte.
          </p>
        </WorkspaceCard>
      ) : null}

      {checkout === "cancelled" ? (
        <WorkspaceCard className="border-amber-400/20 bg-amber-400/10">
          <p className="text-sm font-semibold text-amber-200">
            Checkout cancelado. Puedes intentarlo de nuevo desde el programa
            bloqueado o escribir a soporte si hubo un problema.
          </p>
        </WorkspaceCard>
      ) : null}

      {program && progress ? (
        <>
          <WorkspaceHero
            eyebrow="Workspace privado"
            title={`Hola${user.name ? `, ${user.name}` : ""}. Ya estás dentro de tu producto activo.`}
            description="Tu acceso está habilitado. Retoma la siguiente lección, revisa el mapa del programa y mantén continuidad dentro del mismo entorno privado."
            action={<SignOutButton variant="dark" />}
          >
            <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-300">
                  Siguiente paso recomendado
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-white">
                  {progress.nextLesson?.lesson.title ?? "Programa completado"}
                </h2>
                <p className="mt-3 text-sm leading-7 text-neutral-400">
                  {program.title}
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href={continueHref}
                    className="rounded-md bg-teal-400 px-4 py-2 text-sm font-semibold text-neutral-950 transition hover:bg-teal-300"
                  >
                    Continuar aprendizaje
                  </Link>
                  <Link
                    href={`/app/programas/${program.slug}`}
                    className="rounded-md border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:border-neutral-500"
                  >
                    Ver mapa del programa
                  </Link>
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
                <ProgressMeter
                  percent={progress.percent}
                  label={`${progress.completedCount}/${progress.totalCount} lecciones`}
                />
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
                    <p className="text-xs text-neutral-500">Módulos</p>
                    <p className="mt-1 text-2xl font-semibold text-white">
                      {program.modules.length}
                    </p>
                  </div>
                  <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
                    <p className="text-xs text-neutral-500">Lecciones</p>
                    <p className="mt-1 text-2xl font-semibold text-white">
                      {lessonCount}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </WorkspaceHero>

          <div className="grid gap-4 md:grid-cols-3">
            <WorkspaceCard>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                Acceso
              </p>
              <p className="mt-2 text-lg font-semibold text-white">Activo</p>
              <p className="mt-2 text-sm leading-6 text-neutral-400">
                Tu cuenta puede consumir el producto asociado.
              </p>
            </WorkspaceCard>
            <WorkspaceCard>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                Updates
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                Dentro del workspace
              </p>
              <p className="mt-2 text-sm leading-6 text-neutral-400">
                Nuevas publicaciones aparecerán en la misma experiencia.
              </p>
            </WorkspaceCard>
            <WorkspaceCard>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                Soporte
              </p>
              <Link
                href="/app/soporte"
                className="mt-2 inline-flex text-lg font-semibold text-white underline decoration-neutral-600 underline-offset-4"
              >
                Resolver acceso o pago
              </Link>
              <p className="mt-2 text-sm leading-6 text-neutral-400">
                Usa soporte si algo no se refleja como esperas.
              </p>
            </WorkspaceCard>
          </div>
        </>
      ) : lockedProgram ? (
        <div className="space-y-6">
          <WorkspaceHero
            eyebrow="Acceso pendiente"
            title="Estás a un paso de entrar a un entorno privado de construcción real."
            description="Tu cuenta ya existe. Ahora puedes activar el acceso al producto activo y entrar al programa, sus lecciones, progreso y soporte dentro del workspace."
            action={<SignOutButton variant="dark" />}
          >
            <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
              <AccessRequiredCard
                title={lockedProgram.title}
                description="Activa el acceso para abrir el programa premium, ver los módulos publicados y continuar dentro de una experiencia guiada."
                productSlug={lockedProgram.product?.slug}
              />
              <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-300">
                  Vista previa del contenido
                </p>
                <div className="mt-5 space-y-3">
                  {lockedProgram.modules.slice(0, 3).map((module) => (
                    <div
                      key={module.id}
                      className="rounded-xl border border-neutral-800 bg-neutral-900 p-4"
                    >
                      <p className="text-sm font-semibold text-white">
                        {module.title}
                      </p>
                      <p className="mt-1 text-xs text-neutral-500">
                        {module.lessons.length} lecciones publicadas
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </WorkspaceHero>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Compra segura", "Checkout conectado y retorno automático."],
              ["Acceso centralizado", "Tu dashboard refleja lo que tienes activo."],
              ["Continuidad real", "El progreso queda dentro de tu cuenta."],
            ].map(([title, description]) => (
              <WorkspaceCard key={title}>
                <p className="text-lg font-semibold text-white">{title}</p>
                <p className="mt-2 text-sm leading-6 text-neutral-400">
                  {description}
                </p>
              </WorkspaceCard>
            ))}
          </div>
        </div>
      ) : (
        <WorkspaceHero
          eyebrow="Workspace privado"
          title="Tu cuenta está lista. El contenido publicado aparecerá aquí."
          description="Cuando haya programas disponibles para tu cuenta, verás el acceso activo, la continuidad y el siguiente paso recomendado."
          action={<SignOutButton variant="dark" />}
        />
      )}
    </div>
  );
}
