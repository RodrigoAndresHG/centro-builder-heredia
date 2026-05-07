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
  builderUpdateTypes,
  getBuilderUpdateTypeLabel,
  getProgramProgress,
  isBuilderUpdateType,
  listProgramsForViewer,
  listPublishedBuilderUpdates,
} from "@/lib/services";

const updatesPageSize = 7;

type UserUpdatesPageProps = {
  searchParams: Promise<{ type?: string; page?: string }>;
};

function formatDate(date: Date | null) {
  if (!date) {
    return "Publicado recientemente";
  }

  return new Intl.DateTimeFormat("es", {
    dateStyle: "medium",
  }).format(date);
}

function parsePage(value?: string) {
  const parsedPage = Number.parseInt(value ?? "1", 10);

  return Number.isFinite(parsedPage) ? Math.max(1, parsedPage) : 1;
}

function getUpdateHref(id: string) {
  return `/app/updates/${id}`;
}

function getFilterHref(type?: string, page = 1) {
  const params = new URLSearchParams();

  if (type) {
    params.set("type", type);
  }

  if (page > 1) {
    params.set("page", `${page}`);
  }

  const query = params.toString();

  return query ? `/app/updates?${query}` : "/app/updates";
}

function TypePill({ type }: { type: string }) {
  const label = getBuilderUpdateTypeLabel(type);
  const styles: Record<string, string> = {
    NOVEDAD: "border-teal-400/20 bg-teal-400/10 text-teal-200",
    TIP: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
    IA: "border-sky-400/20 bg-sky-400/10 text-sky-200",
    RECOMENDACION: "border-amber-400/20 bg-amber-400/10 text-amber-200",
  };

  return (
    <span
      className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${
        styles[type] ?? styles.NOVEDAD
      }`}
    >
      {label}
    </span>
  );
}

function compactSummary(summary: string) {
  return summary.length > 210 ? `${summary.slice(0, 207).trim()}...` : summary;
}

export default async function UserUpdatesPage({
  searchParams,
}: UserUpdatesPageProps) {
  const { type: rawType, page: rawPage } = await searchParams;
  const session = await auth();
  const user = session?.user;

  if (!user) {
    redirect("/login?callbackUrl=/app/updates");
  }

  const selectedType = rawType && isBuilderUpdateType(rawType) ? rawType : undefined;
  const currentPage = parsePage(rawPage);
  const [{ availablePrograms, lockedPrograms }, updatePage] = await Promise.all([
    listProgramsForViewer({
      id: user.id,
      role: user.role,
    }),
    listPublishedBuilderUpdates({
      type: selectedType,
      page: currentPage,
      pageSize: updatesPageSize,
    }),
  ]);
  const activeProgram = availablePrograms[0] ?? null;
  const lockedProgram = lockedPrograms[0] ?? null;
  const progress = activeProgram
    ? await getProgramProgress(user.id, activeProgram)
    : null;
  const continueHref =
    progress?.nextLesson?.href ??
    (activeProgram ? `/app/programas/${activeProgram.slug}` : "/app/programas");
  const featuredUpdate = updatePage.updates[0] ?? null;
  const secondaryUpdates = updatePage.updates.slice(1);

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
        description="Un feed privado, curado y práctico: novedades del sistema, tips accionables, señales de IA y recomendaciones aterrizadas para construir mejor."
      >
        <div className="flex flex-wrap gap-2">
          <Link
            href={getFilterHref()}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5 ${
              selectedType
                ? "border-neutral-800 bg-neutral-950 text-neutral-300 hover:border-neutral-600"
                : "border-teal-400/30 bg-teal-400/10 text-teal-100"
            }`}
          >
            Todas
          </Link>
          {builderUpdateTypes.map((updateType) => (
            <Link
              key={updateType.value}
              href={getFilterHref(updateType.value)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5 ${
                selectedType === updateType.value
                  ? "border-teal-400/30 bg-teal-400/10 text-teal-100"
                  : "border-neutral-800 bg-neutral-950 text-neutral-300 hover:border-neutral-600"
              }`}
            >
              {updateType.label}
            </Link>
          ))}
        </div>
      </WorkspaceHero>

      {featuredUpdate ? (
        <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <WorkspaceCard className="overflow-hidden p-0">
            {featuredUpdate.imageUrl ? (
              <div
                className="h-64 border-b border-neutral-800 bg-cover bg-center"
                style={{ backgroundImage: `url(${featuredUpdate.imageUrl})` }}
              />
            ) : (
              <div className="border-b border-neutral-800 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.18),transparent_35%),linear-gradient(135deg,#111827,#050505)] p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-200">
                  Pieza destacada
                </p>
                <p className="mt-16 text-sm font-semibold text-neutral-500">
                  Builder HeredIA
                </p>
              </div>
            )}
            <div className="p-6 lg:p-7">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <TypePill type={featuredUpdate.type} />
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
                  {formatDate(featuredUpdate.publishedAt ?? featuredUpdate.createdAt)}
                </span>
              </div>
              <h2 className="mt-5 text-2xl font-semibold leading-tight text-white sm:text-3xl">
                {featuredUpdate.title}
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-neutral-300">
                {featuredUpdate.summary}
              </p>
              <Link
                href={getUpdateHref(featuredUpdate.id)}
                className="mt-6 inline-flex rounded-md bg-teal-300 px-4 py-2 text-sm font-semibold text-neutral-950 shadow-lg shadow-teal-950/40 transition hover:-translate-y-0.5 hover:bg-teal-200"
              >
                Leer completa
              </Link>
            </div>
          </WorkspaceCard>

          <WorkspaceCard className="flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                Lectura curada
              </p>
              <h2 className="mt-3 text-2xl font-semibold leading-tight text-white">
                Menos ruido. Más criterio para construir.
              </h2>
              <p className="mt-3 text-sm leading-7 text-neutral-400">
                Las novedades están pensadas para que puedas escanear rápido,
                entrar al detalle cuando algo importa y volver al recorrido sin
                perder foco.
              </p>
            </div>
            <div className="mt-6 rounded-2xl border border-teal-400/20 bg-teal-400/10 p-4">
              <p className="text-sm font-semibold text-teal-100">
                {updatePage.totalCount} publicaciones publicadas
                {selectedType
                  ? ` en ${getBuilderUpdateTypeLabel(selectedType)}`
                  : " en el ecosistema"}
                .
              </p>
            </div>
          </WorkspaceCard>
        </section>
      ) : (
        <WorkspaceCard>
          <p className="text-sm leading-7 text-neutral-400">
            Todavía no hay novedades publicadas para este filtro. Cuando Rodrigo
            publique cambios, tips o recomendaciones, aparecerán aquí.
          </p>
        </WorkspaceCard>
      )}

      {secondaryUpdates.length > 0 ? (
        <section className="space-y-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-300">
                Feed compacto
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Más novedades para revisar
              </h2>
            </div>
            <p className="text-sm text-neutral-500">
              Página {updatePage.page} de {updatePage.totalPages}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {secondaryUpdates.map((update) => (
              <Link
                key={update.id}
                href={getUpdateHref(update.id)}
                className="group flex min-h-[260px] flex-col overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-teal-400/40"
              >
                {update.imageUrl ? (
                  <div
                    className="h-32 border-b border-neutral-800 bg-cover bg-center"
                    style={{ backgroundImage: `url(${update.imageUrl})` }}
                  />
                ) : null}
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center justify-between gap-3">
                    <TypePill type={update.type} />
                    <span className="text-xs font-semibold text-neutral-500">
                      {formatDate(update.publishedAt ?? update.createdAt)}
                    </span>
                  </div>
                  <h3 className="mt-4 line-clamp-2 text-lg font-semibold leading-snug text-white">
                    {update.title}
                  </h3>
                  <p className="mt-3 line-clamp-4 text-sm leading-6 text-neutral-400">
                    {compactSummary(update.summary)}
                  </p>
                  <span className="mt-auto pt-5 text-sm font-semibold text-teal-200 transition group-hover:text-teal-100">
                    Ver más
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {updatePage.totalPages > 1 ? (
        <div className="flex flex-col gap-3 rounded-2xl border border-neutral-800 bg-neutral-900 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-neutral-300">
            Página {updatePage.page} de {updatePage.totalPages}
          </p>
          <div className="flex gap-2">
            {updatePage.page > 1 ? (
              <Link
                href={getFilterHref(selectedType, updatePage.page - 1)}
                className="rounded-md border border-neutral-700 bg-neutral-950 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-neutral-500"
              >
                Anterior
              </Link>
            ) : null}
            {updatePage.page < updatePage.totalPages ? (
              <Link
                href={getFilterHref(selectedType, updatePage.page + 1)}
                className="rounded-md bg-teal-300 px-4 py-2 text-sm font-semibold text-neutral-950 transition hover:-translate-y-0.5 hover:bg-teal-200"
              >
                Siguiente
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}

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
