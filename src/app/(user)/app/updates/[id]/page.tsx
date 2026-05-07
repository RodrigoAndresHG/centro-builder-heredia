import Link from "next/link";
import { notFound, redirect } from "next/navigation";

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
  getPublishedBuilderUpdate,
  listProgramsForViewer,
} from "@/lib/services";

type UpdateDetailPageProps = {
  params: Promise<{ id: string }>;
};

function formatDate(date: Date | null) {
  if (!date) {
    return "Publicado recientemente";
  }

  return new Intl.DateTimeFormat("es", {
    dateStyle: "full",
  }).format(date);
}

function TypePill({ type }: { type: string }) {
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
      {getBuilderUpdateTypeLabel(type)}
    </span>
  );
}

export default async function UpdateDetailPage({ params }: UpdateDetailPageProps) {
  const [{ id }, session] = await Promise.all([params, auth()]);
  const user = session?.user;

  if (!user) {
    redirect(`/login?callbackUrl=/app/updates/${id}`);
  }

  const [update, { availablePrograms, lockedPrograms }] = await Promise.all([
    getPublishedBuilderUpdate(id),
    listProgramsForViewer({
      id: user.id,
      role: user.role,
    }),
  ]);

  if (!update) {
    notFound();
  }

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
          { label: "Novedades", href: "/app/updates" },
          { label: "Detalle" },
        ]}
      />

      <WorkspaceHero
        eyebrow="Novedades Builder"
        title={update.title}
        description={update.summary}
        action={
          <Link
            href="/app/updates"
            className="inline-flex justify-center rounded-md border border-neutral-700 bg-neutral-950 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-neutral-500"
          >
            Volver al feed
          </Link>
        }
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <TypePill type={update.type} />
          <span className="text-sm font-semibold text-neutral-400">
            {formatDate(update.publishedAt ?? update.createdAt)}
          </span>
        </div>
      </WorkspaceHero>

      <article className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <WorkspaceCard className="overflow-hidden p-0">
          {update.imageUrl ? (
            <div
              className="h-72 border-b border-neutral-800 bg-cover bg-center"
              style={{ backgroundImage: `url(${update.imageUrl})` }}
            />
          ) : null}
          <div className="p-6 lg:p-8">
            <div className="prose prose-invert max-w-none">
              <p className="whitespace-pre-line text-base leading-8 text-neutral-300">
                {update.content}
              </p>
            </div>
          </div>
        </WorkspaceCard>

        <div className="space-y-4">
          <WorkspaceCard>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
              Contexto
            </p>
            <h2 className="mt-3 text-xl font-semibold text-white">
              Lee con foco y vuelve al sistema
            </h2>
            <p className="mt-3 text-sm leading-7 text-neutral-400">
              Esta novedad vive separada del feed para mantener la lectura limpia
              y que el listado siga escalando cuando haya más publicaciones.
            </p>
          </WorkspaceCard>

          <WorkspaceCard>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-300">
              Siguiente paso
            </p>
            <div className="mt-4 flex flex-col gap-3">
              {activeProgram ? (
                <Link
                  href={continueHref}
                  className="inline-flex justify-center rounded-md bg-teal-300 px-4 py-2 text-sm font-semibold text-neutral-950 shadow-lg shadow-teal-950/40 transition hover:-translate-y-0.5 hover:bg-teal-200"
                >
                  Continuar recorrido
                </Link>
              ) : lockedProgram?.product?.slug ? (
                <CheckoutButton
                  productSlug={lockedProgram.product.slug}
                  label="Activar acceso fundador"
                />
              ) : null}
              <Link
                href="/app/updates"
                className="inline-flex justify-center rounded-md border border-neutral-700 bg-neutral-950 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-neutral-500"
              >
                Ver más novedades
              </Link>
            </div>
          </WorkspaceCard>
        </div>
      </article>
    </div>
  );
}
