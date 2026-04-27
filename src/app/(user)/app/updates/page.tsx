import Link from "next/link";
import { redirect } from "next/navigation";

import { CheckoutButton } from "@/components/app/checkout-button";
import {
  WorkspaceCard,
  WorkspaceHero,
  WorkspaceTrail,
} from "@/components/app/workspace-card";
import { auth } from "@/lib/auth";
import {
  getBuilderUpdateTypeLabel,
  getProgramProgress,
  listProgramsForViewer,
  listPublishedBuilderUpdates,
} from "@/lib/services";

function formatDate(date: Date | null) {
  if (!date) {
    return "Publicado recientemente";
  }

  return new Intl.DateTimeFormat("es", {
    dateStyle: "medium",
  }).format(date);
}

export default async function UserUpdatesPage() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    redirect("/login?callbackUrl=/app/updates");
  }

  const [{ availablePrograms, lockedPrograms }, updates] = await Promise.all([
    listProgramsForViewer({
      id: user.id,
      role: user.role,
    }),
    listPublishedBuilderUpdates(),
  ]);
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
        items={[
          { label: "Workspace", href: "/app" },
          { label: "Novedades" },
        ]}
      />

      <WorkspaceHero
        eyebrow="Novedades Builder"
        title="Mantente al día con lo que sí importa"
        description="Aquí encontrarás novedades del sistema, tips prácticos y señales relevantes de IA explicadas con criterio para ayudarte a construir mejor."
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {["Novedad", "Tip", "IA", "Recomendación"].map((type) => (
            <div
              key={type}
              className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                Categoría
              </p>
              <p className="mt-2 text-lg font-semibold text-white">{type}</p>
            </div>
          ))}
        </div>
      </WorkspaceHero>

      <section className="grid gap-4 lg:grid-cols-[0.7fr_1.3fr]">
        <WorkspaceCard className="p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Feed vivo
          </p>
          <h2 className="mt-3 text-2xl font-semibold leading-tight text-white">
            Builder se actualiza con criterio
          </h2>
          <p className="mt-3 text-sm leading-7 text-neutral-400">
            Este espacio reúne cambios del LMS, tips accionables, señales de IA
            y recomendaciones pensadas para usuarios que quieren construir con
            más claridad.
          </p>
          <div className="mt-5 rounded-2xl border border-teal-400/20 bg-teal-400/10 p-4">
            <p className="text-sm font-semibold text-teal-100">
              {activeProgram
                ? "Tu acceso está activo. Usa las novedades para mantener contexto y volver mejor al recorrido."
                : "Puedes revisar el pulso del ecosistema antes de activar tu acceso premium."}
            </p>
          </div>
        </WorkspaceCard>

        <div className="grid gap-4">
          {updates.map((update) => (
            <WorkspaceCard key={update.id} className="overflow-hidden p-0">
              {update.imageUrl ? (
                <div
                  className="h-44 border-b border-neutral-800 bg-cover bg-center"
                  style={{ backgroundImage: `url(${update.imageUrl})` }}
                />
              ) : null}
              <div className="p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-300">
                      {getBuilderUpdateTypeLabel(update.type)}
                    </p>
                    <h2 className="mt-3 text-xl font-semibold leading-tight text-white">
                      {update.title}
                    </h2>
                  </div>
                  <span className="w-fit rounded-full border border-neutral-800 bg-neutral-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">
                    {formatDate(update.publishedAt ?? update.createdAt)}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-7 text-neutral-300">
                  {update.summary}
                </p>
                <p className="mt-4 whitespace-pre-line text-sm leading-7 text-neutral-500">
                  {update.content}
                </p>
              </div>
            </WorkspaceCard>
          ))}

          {updates.length === 0 ? (
            <WorkspaceCard>
              <p className="text-sm leading-7 text-neutral-400">
                Todavía no hay novedades publicadas. Cuando Rodrigo publique
                cambios, tips o recomendaciones, aparecerán aquí.
              </p>
            </WorkspaceCard>
          ) : null}
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
            ? "Las novedades te dan contexto; el avance real ocurre dentro del programa, módulo por módulo y lección por lección."
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
