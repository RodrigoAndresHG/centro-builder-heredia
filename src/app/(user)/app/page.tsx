import Link from "next/link";
import { redirect } from "next/navigation";

import { AccessRequiredCard } from "@/components/app/access-required-card";
import { ProgressMeter } from "@/components/app/progress-meter";
import { WelcomeVideoCard } from "@/components/app/welcome-video-card";
import {
  WorkspaceCard,
  WorkspaceHero,
  WorkspaceMetric,
} from "@/components/app/workspace-card";
import { SignOutButton } from "@/components/shared/sign-out-button";
import { auth } from "@/lib/auth";
import {
  getProgramLessonCount,
  getProgramProgress,
  listProgramsForViewer,
} from "@/lib/services";

type UserDashboardPageProps = {
  searchParams: Promise<{ checkout?: string; intent?: string }>;
};

export default async function UserDashboardPage({
  searchParams,
}: UserDashboardPageProps) {
  const { checkout, intent } = await searchParams;
  const session = await auth();
  const user = session?.user;

  if (!user) {
    const callbackUrl = intent ? `/app?intent=${intent}` : "/app";
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  const { availablePrograms, lockedPrograms } = await listProgramsForViewer({
    id: user.id,
    role: user.role,
  });
  const program = availablePrograms[0] ?? null;
  const lockedProgram = lockedPrograms[0] ?? null;
  const lessonCount = getProgramLessonCount(program);
  const progress = program ? await getProgramProgress(user.id, program) : null;
  const isBuyIntent = intent === "buy";
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
            title={`Hola${user.name ? `, ${user.name}` : ""}. Tu build sigue en movimiento.`}
            description="Retoma el siguiente paso, revisa el mapa del programa y mantén continuidad dentro de un entorno privado diseñado para construir con foco."
            action={<SignOutButton variant="dark" />}
          >
            <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-2xl border border-teal-400/20 bg-teal-400/10 p-5">
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
                    className="rounded-md bg-teal-300 px-4 py-2 text-sm font-semibold text-neutral-950 shadow-lg shadow-teal-950/40 transition hover:bg-teal-200"
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
                    <p className="text-xs uppercase tracking-[0.16em] text-neutral-500">Módulos</p>
                    <p className="mt-1 text-2xl font-semibold text-white">
                      {program.modules.length}
                    </p>
                  </div>
                  <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-neutral-500">Lecciones</p>
                    <p className="mt-1 text-2xl font-semibold text-white">
                      {lessonCount}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </WorkspaceHero>

          <WelcomeVideoCard
            badge="Tu recorrido empieza aquí"
            title="Bienvenido a tu entorno privado de Builder"
            description="Mira esta guía rápida para entender cómo avanzar dentro del programa, seguir el build, retomar tu progreso y aprovechar mejor el sistema desde el primer día."
            primaryHref={continueHref}
            primaryLabel="Continuar programa"
            secondaryHref="/app/updates"
            secondaryLabel="Ver updates"
            videoSrc="/video/welcome-member.mp4"
            videoLabel="Guía privada"
          />

          <div className="grid gap-4 md:grid-cols-3">
            <WorkspaceMetric
              label="Acceso"
              value="Activo"
              detail="Tu cuenta puede consumir el producto asociado."
            />
            <WorkspaceMetric
              label="Updates"
              value="Workspace"
              detail="Nuevas publicaciones aparecerán en la misma experiencia."
            />
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
          <WelcomeVideoCard
            badge={isBuyIntent ? "Acceso fundador" : "Bienvenido a Builder"}
            title={
              isBuyIntent
                ? "Estás a un paso de activar Builder"
                : "Antes de entrar, entiende cómo funciona Builder"
            }
            description={
              isBuyIntent
                ? "Tu cuenta ya está lista. Completa la compra del acceso fundador y entra al programa privado con módulos, lecciones, progreso y soporte dentro del LMS."
                : "Mira esta introducción rápida para entender qué encontrarás dentro del LMS oficial de Rodrigo HeredIA y por qué el primer programa abre una forma distinta de aprender a construir productos Multi-IA reales."
            }
            primaryHref={isBuyIntent ? "#activar-acceso" : "/programas/build-ideacash"}
            primaryLabel={isBuyIntent ? "Activar acceso fundador" : "Ver el programa activo"}
            secondaryHref={isBuyIntent ? "/programas/build-ideacash" : "/#acceso-temprano"}
            secondaryLabel={
              isBuyIntent ? "Ver detalles del programa" : "Quiero acceso prioritario"
            }
            videoSrc="/video/welcome-guest.mp4"
            videoLabel="Intro invitado"
          />

          <WorkspaceHero
            eyebrow={isBuyIntent ? "Compra iniciada" : "Acceso pendiente"}
            title={
              isBuyIntent
                ? "Tu acceso está listo para activarse."
                : "Ya estás dentro del sistema. El producto premium está a un paso."
            }
            description={
              isBuyIntent
                ? "Completa la entrada a Builder con el precio fundador y conserva compra, acceso y progreso en esta misma cuenta."
                : "Activa el acceso al programa activo y entra al recorrido privado con módulos, lecciones, progreso y soporte dentro del mismo workspace."
            }
            action={<SignOutButton variant="dark" />}
          >
            <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
              <div id="activar-acceso" className="scroll-mt-8">
                <AccessRequiredCard
                  title={lockedProgram.title}
                  description={
                    isBuyIntent
                      ? "Completa la compra para abrir el programa premium, conservar tu acceso y comenzar el recorrido dentro del entorno privado."
                      : "Activa el acceso para abrir el programa premium, ver los módulos publicados y continuar dentro de una experiencia guiada."
                  }
                  productSlug={lockedProgram.product?.slug}
                />
              </div>
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
              <WorkspaceMetric key={title} label="Sistema" value={title} detail={description} />
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
