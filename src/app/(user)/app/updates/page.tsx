import Link from "next/link";
import { redirect } from "next/navigation";

import { CheckoutButton } from "@/components/app/checkout-button";
import {
  WorkspaceCard,
  WorkspaceHero,
  WorkspaceTrail,
} from "@/components/app/workspace-card";
import { auth } from "@/lib/auth";
import { getProgramProgress, listProgramsForViewer } from "@/lib/services";

const updateTypes = [
  {
    label: "Product Updates",
    title: "Cambios dentro de Builder",
    description:
      "Mejoras del LMS, nuevas piezas del recorrido y ajustes que hacen más claro el sistema.",
  },
  {
    label: "Builder Notes",
    title: "Criterio del build",
    description:
      "Notas breves sobre decisiones de producto, estructura y forma de construir con más foco.",
  },
  {
    label: "Frontier Signals",
    title: "Señales Multi-IA",
    description:
      "Cambios relevantes de GPT, Claude o Gemini aterrizados a productos reales dentro de Builder.",
  },
];

const updates = [
  {
    type: "Product Updates",
    date: "Abril 2026",
    title: "El workspace privado ya muestra acceso, progreso y continuidad",
    description:
      "Builder deja de ser una superficie estática: el dashboard privado ahora orienta el siguiente paso, el estado del acceso y la ruta activa del programa.",
    cta: "Ver dashboard",
    href: "/app",
  },
  {
    type: "Builder Notes",
    date: "Abril 2026",
    title: "Por qué el primer recorrido empieza con IdeaCash",
    description:
      "IdeaCash funciona como objeto de estudio porque obliga a conectar idea, lógica Multi-IA, interfaz, acceso y operación comercial en un solo producto.",
    cta: "Ver programa",
    href: "/app/programas",
  },
  {
    type: "Frontier Signals",
    date: "Abril 2026",
    title: "La ventaja no está en usar una IA, sino en orquestarlas bien",
    description:
      "El criterio de Builder no es perseguir novedades sueltas: es entender cuándo usar OpenAI, Anthropic o Gemini dentro de un flujo de producto útil.",
  },
  {
    type: "Product Updates",
    date: "Abril 2026",
    title: "La pestaña Programas ya funciona como mapa del ecosistema",
    description:
      "Programas ahora comunica el recorrido activo, próximos caminos y el valor del acceso premium como sistema, no como una lista de cursos.",
    cta: "Explorar programas",
    href: "/app/programas",
  },
  {
    type: "Builder Notes",
    date: "Abril 2026",
    title: "Menos contenido suelto, más continuidad",
    description:
      "El LMS está pensado para que cada módulo y lección tenga contexto. La meta es que sepas dónde estás, qué sigue y por qué importa.",
  },
  {
    type: "Frontier Signals",
    date: "Abril 2026",
    title: "Los modelos cambian rápido; el sistema debe absorber el cambio",
    description:
      "Cuando GPT, Claude o Gemini mejoran, Builder lo interpreta desde la arquitectura del producto: qué desbloquea, dónde encaja y cómo se aplica.",
  },
];

export default async function UserUpdatesPage() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    redirect("/login?callbackUrl=/app/updates");
  }

  const { availablePrograms, lockedPrograms } = await listProgramsForViewer({
    id: user.id,
    role: user.role,
  });
  const activeProgram = availablePrograms[0] ?? null;
  const lockedProgram = lockedPrograms[0] ?? null;
  const progress = activeProgram
    ? await getProgramProgress(user.id, activeProgram)
    : null;
  const continueHref =
    progress?.nextLesson?.href ??
    (activeProgram ? `/app/programas/${activeProgram.slug}` : "/app/programas");

  return (
    <div className="space-y-8">
      <WorkspaceTrail
        items={[{ label: "Workspace", href: "/app" }, { label: "Updates" }]}
      />

      <WorkspaceHero
        eyebrow="Builder Updates"
        title="Sigue la evolución del sistema"
        description="Aquí encontrarás avances del producto, señales del ecosistema y notas útiles para construir mejor dentro de Builder HeredIA."
      >
        <div className="grid gap-3 md:grid-cols-3">
          {updateTypes.map((type) => (
            <div
              key={type.label}
              className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-300">
                {type.label}
              </p>
              <h2 className="mt-3 text-lg font-semibold text-white">
                {type.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-neutral-400">
                {type.description}
              </p>
            </div>
          ))}
        </div>
      </WorkspaceHero>

      <section className="grid gap-4 lg:grid-cols-[0.7fr_1.3fr]">
        <WorkspaceCard className="p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Estado del feed
          </p>
          <h2 className="mt-3 text-2xl font-semibold leading-tight text-white">
            Builder está en construcción activa
          </h2>
          <p className="mt-3 text-sm leading-7 text-neutral-400">
            Este feed existe para que no pierdas el pulso del sistema: qué se
            mejora, qué se aprende y qué señales externas importan de verdad.
          </p>
          <div className="mt-5 rounded-2xl border border-teal-400/20 bg-teal-400/10 p-4">
            <p className="text-sm font-semibold text-teal-100">
              {activeProgram
                ? "Tu acceso está activo. Vuelve aquí para seguir la evolución del build."
                : "Aun sin acceso premium, puedes ver cómo evoluciona el ecosistema antes de activarlo."}
            </p>
          </div>
        </WorkspaceCard>

        <div className="grid gap-4">
          {updates.map((update) => (
            <WorkspaceCard key={update.title} className="p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-300">
                    {update.type}
                  </p>
                  <h2 className="mt-3 text-xl font-semibold leading-tight text-white">
                    {update.title}
                  </h2>
                </div>
                <span className="w-fit rounded-full border border-neutral-800 bg-neutral-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">
                  {update.date}
                </span>
              </div>
              <p className="mt-4 text-sm leading-7 text-neutral-400">
                {update.description}
              </p>
              {update.href && update.cta ? (
                <Link
                  href={update.href}
                  className="mt-5 inline-flex rounded-md border border-neutral-700 bg-neutral-950 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-teal-400/40"
                >
                  {update.cta}
                </Link>
              ) : null}
            </WorkspaceCard>
          ))}
        </div>
      </section>

      <WorkspaceHero
        eyebrow={activeProgram ? "Continuidad" : "Acceso premium"}
        title={
          activeProgram
            ? "Vuelve al recorrido cuando estés listo"
            : "Activa el acceso para entrar al sistema completo"
        }
        description={
          activeProgram
            ? "Los updates te dan contexto; el avance real ocurre dentro del programa, módulo por módulo y lección por lección."
            : "El feed muestra el pulso del ecosistema. El acceso premium desbloquea el programa activo, progreso, módulos, lecciones y soporte dentro del LMS."
        }
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {activeProgram ? (
            <Link
              href={continueHref}
              className="inline-flex justify-center rounded-md bg-teal-300 px-4 py-2 text-sm font-semibold text-neutral-950 shadow-lg shadow-teal-950/40 transition hover:-translate-y-0.5 hover:bg-teal-200"
            >
              {progress && progress.completedCount > 0
                ? "Continuar recorrido"
                : "Volver a mi programa"}
            </Link>
          ) : lockedProgram?.product?.slug ? (
            <CheckoutButton
              productSlug={lockedProgram.product.slug}
              label="Activar acceso fundador"
            />
          ) : null}
          <Link
            href="/app/programas"
            className="inline-flex justify-center rounded-md border border-neutral-700 bg-neutral-950 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-neutral-500"
          >
            Ver programas
          </Link>
        </div>
      </WorkspaceHero>
    </div>
  );
}
