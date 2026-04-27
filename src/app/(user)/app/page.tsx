import Link from "next/link";
import { redirect } from "next/navigation";

import { CheckoutButton } from "@/components/app/checkout-button";
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

const featuredProgramBullets = [
  "Replica una app real desde cero",
  "Conecta OpenAI, Anthropic y Gemini",
  "Avanza dentro de un sistema con continuidad",
  "Accede a updates y soporte dentro del LMS",
];

const premiumUnlockItems = [
  "Programa activo completo",
  "Módulos y lecciones estructuradas",
  "Continuidad y progreso",
  "Updates del build",
  "Soporte dentro de la plataforma",
];

const activationReinforcements = [
  "Precio fundador hoy: USD 47",
  "Apertura oficial: 16 de mayo de 2026",
  "Precio regular después: USD 67",
];

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
        <div className="space-y-8">
          <WelcomeVideoCard
            badge="Acceso premium pendiente"
            title="Ya estás dentro de Builder. Ahora mira lo que desbloqueas al activar tu acceso."
            description="Explora el entorno, entiende cómo funciona el sistema y descubre por qué el programa activo es el mejor punto de entrada al LMS oficial de Rodrigo HeredIA."
            primaryHref="#activar-acceso"
            primaryLabel="Activar acceso fundador"
            secondaryHref={`/app/programas/${lockedProgram.slug}`}
            secondaryLabel="Ver el programa activo"
            videoSrc="/video/welcome-guest.mp4"
            videoLabel="Bienvenida"
          />

          <section className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
            <WorkspaceCard className="border-teal-400/20 bg-teal-400/10">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-300">
                Programa destacado
              </p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight text-white">
                {lockedProgram.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-neutral-300">
                Empieza por el primer programa de Builder y aprende cómo se
                estructura, conecta y convierte una app Multi-IA en un producto
                real.
              </p>
              <p className="mt-4 rounded-xl border border-neutral-800 bg-neutral-950/70 p-4 text-sm leading-7 text-neutral-300">
                Build IdeaCash — Founder Access
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {lockedProgram.product?.slug ? (
                  <CheckoutButton
                    productSlug={lockedProgram.product.slug}
                    label="Activar acceso fundador"
                  />
                ) : null}
                <Link
                  href={`/app/programas/${lockedProgram.slug}`}
                  className="inline-flex justify-center rounded-md border border-neutral-700 bg-neutral-950 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-neutral-500"
                >
                  Ver el programa activo
                </Link>
              </div>
            </WorkspaceCard>

            <div className="grid gap-3">
              {featuredProgramBullets.map((bullet) => (
                <WorkspaceCard key={bullet} className="p-5">
                  <p className="text-sm font-semibold leading-6 text-white">
                    {bullet}
                  </p>
                </WorkspaceCard>
              ))}
            </div>
          </section>

          <section className="space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-300">
                Valor premium del LMS
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-white">
                Qué desbloquea tu acceso premium
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {premiumUnlockItems.map((item) => (
                <WorkspaceCard key={item} className="p-5">
                  <p className="text-sm font-semibold leading-6 text-white">
                    {item}
                  </p>
                </WorkspaceCard>
              ))}
            </div>
          </section>

          <section id="activar-acceso" className="scroll-mt-8">
            <WorkspaceHero
              eyebrow="Activación"
              title="Activa tu acceso antes del lanzamiento"
              description="Entra hoy con el precio fundador y desbloquea el recorrido completo dentro de Builder antes del siguiente aumento."
              action={<SignOutButton variant="dark" />}
            >
              <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
                <div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {activationReinforcements.map((item) => (
                      <div
                        key={item}
                        className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 text-sm font-semibold text-neutral-200"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    {lockedProgram.product?.slug ? (
                      <CheckoutButton
                        productSlug={lockedProgram.product.slug}
                        label="Activar acceso fundador"
                      />
                    ) : null}
                    <Link
                      href={`/app/programas/${lockedProgram.slug}`}
                      className="inline-flex justify-center rounded-md border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-neutral-500"
                    >
                      Ver el programa activo
                    </Link>
                  </div>
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
          </section>

          <WorkspaceCard className="flex flex-col gap-5 border-neutral-800 bg-neutral-900 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                Acceso prioritario
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                ¿Aún no quieres activarlo? Reserva tu acceso prioritario
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-neutral-400">
                Déjame tus datos y te avisaré antes de la apertura para que
                puedas entrar con prioridad y precio fundador.
              </p>
            </div>
            <Link
              href="/#acceso-temprano"
              className="inline-flex shrink-0 justify-center rounded-md border border-neutral-700 bg-neutral-950 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-teal-400/40"
            >
              Quiero acceso prioritario
            </Link>
          </WorkspaceCard>
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
