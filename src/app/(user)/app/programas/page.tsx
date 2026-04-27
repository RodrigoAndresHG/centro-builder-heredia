import Link from "next/link";
import { redirect } from "next/navigation";

import { CheckoutButton } from "@/components/app/checkout-button";
import { ProgressMeter } from "@/components/app/progress-meter";
import {
  WorkspaceCard,
  WorkspaceHero,
  WorkspaceTrail,
} from "@/components/app/workspace-card";
import { auth } from "@/lib/auth";
import {
  getProgramLessonCount,
  getProgramProgress,
  listProgramsForViewer,
} from "@/lib/services";

const featuredBullets = [
  "Replica una app real desde cero",
  "Conecta OpenAI, Anthropic y Gemini",
  "Avanza con continuidad dentro del LMS",
  "Accede a updates y soporte del build",
];

const upcomingPrograms = [
  [
    "Consejo Estratégico HeredIA",
    "Decisiones, dirección y criterio para construir con más foco.",
  ],
  [
    "Finanzas HeredIA",
    "Estructura financiera aplicada a proyectos, productos y operación.",
  ],
  [
    "Creator Ops",
    "Sistemas operativos para creadores que quieren construir activos reales.",
  ],
];

const premiumUnlockItems = [
  "Programa activo completo",
  "Módulos y lecciones estructuradas",
  "Continuidad y progreso",
  "Updates del ecosistema",
  "Soporte dentro de la plataforma",
];

const activationReinforcements = [
  "Precio fundador hoy: USD 47",
  "Apertura oficial: 16 de mayo de 2026",
  "Precio regular después: USD 67",
];

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
  const featuredProgramProgress = programsWithProgress[0] ?? null;
  const featuredProgram =
    featuredProgramProgress?.program ?? lockedPrograms[0] ?? null;
  const featuredProgress = featuredProgramProgress?.progress ?? null;
  const hasFeaturedAccess = Boolean(featuredProgramProgress);
  const featuredHref = featuredProgram
    ? `/app/programas/${featuredProgram.slug}`
    : "/app/programas";
  const featuredContinueHref =
    featuredProgress?.nextLesson?.href ?? featuredHref;

  return (
    <div className="space-y-8">
      <WorkspaceTrail
        items={[{ label: "Workspace", href: "/app" }, { label: "Programas" }]}
      />

      <WorkspaceHero
        eyebrow="Ecosistema Builder"
        title="Elige tu punto de entrada al ecosistema"
        description="Builder HeredIA está diseñado para crecer como un sistema de programas orientados a construir productos Multi-IA reales. Aquí ves el programa activo y los próximos recorridos del ecosistema."
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
              Estado
            </p>
            <p className="mt-2 text-lg font-semibold text-white">
              Programa activo
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
              Ecosistema
            </p>
            <p className="mt-2 text-lg font-semibold text-white">
              En expansión
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
              Acceso
            </p>
            <p className="mt-2 text-lg font-semibold text-white">
              {hasFeaturedAccess ? "Activo" : "Premium"}
            </p>
          </div>
        </div>
      </WorkspaceHero>

      {featuredProgram ? (
        <section className="grid gap-5 lg:grid-cols-[1fr_0.85fr]">
          <WorkspaceCard className="border-teal-400/20 bg-teal-400/10 p-7">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-300">
                  Programa activo
                </p>
                <h2 className="mt-3 text-3xl font-semibold leading-tight text-white">
                  {featuredProgram.title}
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-300">
                  Empieza por el primer programa de Builder y aprende cómo se
                  estructura, conecta y convierte una app Multi-IA en un producto
                  real.
                </p>
              </div>
              <span className="inline-flex w-fit rounded-full border border-teal-300/20 bg-neutral-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-teal-200">
                {hasFeaturedAccess ? "Acceso activo" : "Founder Access"}
              </span>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {featuredBullets.map((bullet) => (
                <div
                  key={bullet}
                  className="rounded-xl border border-neutral-800 bg-neutral-950/75 p-4 text-sm font-semibold leading-6 text-neutral-100"
                >
                  {bullet}
                </div>
              ))}
            </div>

            {featuredProgress ? (
              <div className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
                <ProgressMeter
                  percent={featuredProgress.percent}
                  label={`${featuredProgress.completedCount}/${featuredProgress.totalCount} lecciones`}
                />
              </div>
            ) : null}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              {hasFeaturedAccess ? (
                <Link
                  href={featuredContinueHref}
                  className="inline-flex justify-center rounded-md bg-teal-300 px-4 py-2 text-sm font-semibold text-neutral-950 shadow-lg shadow-teal-950/40 transition hover:-translate-y-0.5 hover:bg-teal-200"
                >
                  {featuredProgress && featuredProgress.completedCount > 0
                    ? "Continuar programa"
                    : "Abrir programa"}
                </Link>
              ) : featuredProgram.product?.slug ? (
                <CheckoutButton
                  productSlug={featuredProgram.product.slug}
                  label="Activar acceso fundador"
                />
              ) : null}
              <Link
                href={featuredHref}
                className="inline-flex justify-center rounded-md border border-neutral-700 bg-neutral-950 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-neutral-500"
              >
                Ver programa
              </Link>
            </div>
          </WorkspaceCard>

          <div className="grid gap-4">
            <WorkspaceCard className="p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                Estructura
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
                  <p className="text-2xl font-semibold text-white">
                    {featuredProgram.modules.length}
                  </p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
                    Módulos
                  </p>
                </div>
                <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
                  <p className="text-2xl font-semibold text-white">
                    {getProgramLessonCount(featuredProgram)}
                  </p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
                    Lecciones
                  </p>
                </div>
              </div>
            </WorkspaceCard>
            <WorkspaceCard className="p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                Valor del recorrido
              </p>
              <p className="mt-3 text-sm leading-7 text-neutral-300">
                El programa vive dentro de Builder: acceso, continuidad,
                progreso, updates y soporte en un solo entorno privado.
              </p>
            </WorkspaceCard>
          </div>
        </section>
      ) : (
        <WorkspaceCard>
          <p className="text-sm leading-7 text-neutral-300">
            El ecosistema todavía no tiene programas publicados para tu cuenta.
          </p>
        </WorkspaceCard>
      )}

      <section className="space-y-5">
        <div>
          <h2 className="text-2xl font-semibold text-white">
            Próximamente en Builder
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-neutral-400">
            Builder no se detiene en un solo programa. Estos son algunos de los
            próximos recorridos que se integrarán al ecosistema.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {upcomingPrograms.map(([title, description]) => (
            <WorkspaceCard key={title} className="p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                  Próximamente
                </p>
                <span className="rounded-full border border-neutral-700 bg-neutral-950 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-neutral-400">
                  En diseño
                </span>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-white">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-neutral-400">
                {description}
              </p>
            </WorkspaceCard>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <h2 className="text-2xl font-semibold text-white">
            Qué desbloquea tu acceso dentro de Builder
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

      {!hasFeaturedAccess && featuredProgram ? (
        <WorkspaceHero
          eyebrow="Siguiente paso"
          title="Empieza por el programa activo"
          description="Activa tu acceso fundador y entra al primer recorrido de Builder antes del siguiente aumento."
        >
          <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
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
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              {featuredProgram.product?.slug ? (
                <CheckoutButton
                  productSlug={featuredProgram.product.slug}
                  label="Activar acceso fundador"
                />
              ) : null}
              <Link
                href="/app"
                className="inline-flex justify-center rounded-md border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-teal-400/40"
              >
                Quiero acceso prioritario
              </Link>
            </div>
          </div>
        </WorkspaceHero>
      ) : null}
    </div>
  );
}
