import Link from "next/link";
import { redirect } from "next/navigation";

import { CheckoutButton } from "@/components/app/checkout-button";
import {
  WorkspaceCard,
  WorkspaceHero,
  WorkspaceTrail,
} from "@/components/app/workspace-card";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { getProgramProgress, listProgramsForViewer } from "@/lib/services";

function getProviderLabel(provider?: string | null) {
  if (provider === "google") {
    return "Google";
  }

  if (provider === "nodemailer") {
    return "Correo";
  }

  return "Sesión Builder";
}

export default async function PerfilPage() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    redirect("/login?callbackUrl=/app/perfil");
  }

  const [{ availablePrograms, lockedPrograms }, account] = await Promise.all([
    listProgramsForViewer({
      id: user.id,
      role: user.role,
    }),
    prisma.account.findFirst({
      where: { userId: user.id },
      select: { provider: true },
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
  const hasPremiumAccess = Boolean(activeProgram);
  const accessLabel = hasPremiumAccess
    ? "Acceso premium activo"
    : "Acceso explorador";
  const unlockedItems = hasPremiumAccess
    ? [
        "Programa disponible dentro del LMS",
        "Módulos y lecciones publicadas",
        "Continuidad y progreso",
        "Novedades y soporte dentro de Builder",
      ]
    : [
        "Vista privada de Builder",
        "Mapa de programas",
        "Novedades del ecosistema",
        "Activación de acceso fundador",
      ];

  return (
    <div className="space-y-8">
      <WorkspaceTrail
        items={[{ label: "Workspace", href: "/app" }, { label: "Perfil" }]}
      />

      <WorkspaceHero
        eyebrow="Tu cuenta"
        title="Revisa tu acceso dentro de Builder"
        description="Aquí puedes ver el correo con el que entraste, tu estado dentro del LMS y la mejor forma de resolver cualquier diferencia de acceso."
      >
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
              Estado
            </p>
            <p className="mt-2 text-lg font-semibold text-white">
              {accessLabel}
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
              Entrada
            </p>
            <p className="mt-2 text-lg font-semibold text-white">
              {getProviderLabel(account?.provider)}
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
              Programa
            </p>
            <p className="mt-2 text-sm font-semibold leading-6 text-white">
              {activeProgram?.title ?? lockedProgram?.title ?? "Sin programa"}
            </p>
          </div>
        </div>
      </WorkspaceHero>

      <section className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <WorkspaceCard className="p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-300">
            Identidad
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-white">
            Cuenta dentro de Builder
          </h2>
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                Nombre
              </p>
              <p className="mt-2 text-sm font-semibold text-white">
                {user.name ?? "Sin nombre registrado"}
              </p>
            </div>
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                Email
              </p>
              <p className="mt-2 break-all text-sm font-semibold text-white">
                {user.email ?? "Sin correo registrado"}
              </p>
            </div>
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                Método de entrada
              </p>
              <p className="mt-2 text-sm font-semibold text-white">
                {getProviderLabel(account?.provider)}
              </p>
            </div>
          </div>
        </WorkspaceCard>

        <WorkspaceCard className="border-teal-400/20 bg-teal-400/10 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-300">
            Estado de acceso
          </p>
          <h2 className="mt-3 text-2xl font-semibold leading-tight text-white">
            {accessLabel}
          </h2>
          <p className="mt-4 text-sm leading-7 text-neutral-300">
            {hasPremiumAccess
              ? "Tu acceso premium está activo. Ya puedes recorrer el programa disponible dentro del LMS y continuar tu avance."
              : "Estás dentro de Builder en modo exploración. Activa tu acceso para desbloquear el programa completo, continuidad, updates y soporte premium."}
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {unlockedItems.map((item) => (
              <div
                key={item}
                className="rounded-xl border border-neutral-800 bg-neutral-950/75 p-4 text-sm font-semibold leading-6 text-neutral-100"
              >
                {item}
              </div>
            ))}
          </div>
        </WorkspaceCard>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <WorkspaceCard className="p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Diferencias de acceso
          </p>
          <h2 className="mt-3 text-2xl font-semibold leading-tight text-white">
            ¿Pagaste y no ves tu acceso?
          </h2>
          <p className="mt-3 text-sm leading-7 text-neutral-400">
            Asegúrate de haber entrado con el mismo correo usado dentro de
            Builder. Si el problema continúa, escríbenos desde ese mismo correo
            para ayudarte más rápido.
          </p>
          <Link
            href="/app/soporte"
            className="mt-5 inline-flex rounded-md border border-neutral-700 bg-neutral-950 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-teal-400/40"
          >
            Ir a soporte
          </Link>
        </WorkspaceCard>

        <WorkspaceCard className="p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Siguiente acción
          </p>
          <h2 className="mt-3 text-2xl font-semibold leading-tight text-white">
            {hasPremiumAccess
              ? "Continúa dentro del LMS"
              : "Desbloquea el recorrido completo"}
          </h2>
          <p className="mt-3 text-sm leading-7 text-neutral-400">
            {hasPremiumAccess
              ? "Tu cuenta ya está lista para seguir avanzando con continuidad."
              : "Puedes activar el acceso fundador o revisar los programas antes de entrar."}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {hasPremiumAccess ? (
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
              href={hasPremiumAccess ? "/app/updates" : "/app/programas"}
              className="inline-flex justify-center rounded-md border border-neutral-700 bg-neutral-950 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-neutral-500"
            >
              {hasPremiumAccess ? "Ver novedades" : "Ver programas"}
            </Link>
          </div>
        </WorkspaceCard>
      </section>
    </div>
  );
}
