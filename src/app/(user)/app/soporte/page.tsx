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

const supportEmail = "soporte@rodriheredia.com";

const quickHelpItems = [
  {
    title: "Ya pagué y no veo mi acceso",
    description:
      "Espera unos minutos a que Stripe confirme el pago. Si sigue sin aparecer, escríbenos usando el mismo correo con el que entras a Builder.",
  },
  {
    title: "¿Cómo activo mi acceso fundador?",
    description:
      "Entra a Programas o al dashboard y usa el botón Activar acceso fundador. El sistema abrirá el checkout seguro y activará el acceso al confirmarse el pago.",
  },
  {
    title: "¿Dónde veo mis programas?",
    description:
      "Ve a Programas para revisar el recorrido activo, el estado de tu acceso y los próximos caminos del ecosistema Builder.",
  },
  {
    title: "¿Cómo sé si ya tengo acceso premium?",
    description:
      "Si tienes acceso activo, el dashboard muestra continuidad, progreso y un CTA para volver a tu programa o continuar la siguiente lección.",
  },
];

function buildSupportMailto(userEmail?: string | null) {
  const subject = encodeURIComponent("Soporte Builder HeredIA");
  const body = encodeURIComponent(
    [
      "Hola, necesito ayuda con Builder HeredIA.",
      "",
      `Correo de cuenta: ${userEmail ?? "escribe aquí tu correo de Builder"}`,
      "Tema: acceso / pago / uso de la plataforma",
      "",
      "Detalle:",
    ].join("\n"),
  );

  return `mailto:${supportEmail}?subject=${subject}&body=${body}`;
}

export default async function SoportePage() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    redirect("/login?callbackUrl=/app/soporte");
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
        items={[{ label: "Workspace", href: "/app" }, { label: "Soporte" }]}
      />

      <WorkspaceHero
        eyebrow="Soporte Builder"
        title="Resuelve dudas y recupera tu acceso más rápido"
        description="Aquí encontrarás ayuda para acceso, uso de la plataforma y pagos, además de una forma clara de contactarnos si necesitas soporte real."
      >
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
              Cuenta
            </p>
            <p className="mt-2 break-all text-sm font-semibold text-white">
              {user.email ?? "Sin correo detectado"}
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
              Acceso
            </p>
            <p className="mt-2 text-sm font-semibold text-white">
              {activeProgram ? "Premium activo" : "Pendiente de activación"}
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
              Programa
            </p>
            <p className="mt-2 text-sm font-semibold text-white">
              {activeProgram?.title ?? lockedProgram?.title ?? "Sin programa"}
            </p>
          </div>
        </div>
      </WorkspaceHero>

      <section className="space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-300">
            Ayuda rápida
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-white">
            Respuestas para resolver fricción común
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {quickHelpItems.map((item) => (
            <WorkspaceCard key={item.title} className="p-5">
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-neutral-400">
                {item.description}
              </p>
            </WorkspaceCard>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <WorkspaceCard className="border-teal-400/20 bg-teal-400/10 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-300">
            Tu siguiente paso
          </p>
          <h2 className="mt-3 text-2xl font-semibold leading-tight text-white">
            {activeProgram
              ? "Retoma tu recorrido dentro de Builder"
              : "Activa tu acceso para desbloquear el sistema"}
          </h2>
          <p className="mt-3 text-sm leading-7 text-neutral-300">
            {activeProgram
              ? "Si tu acceso ya está activo, usa soporte solo para incidencias reales. Para seguir avanzando, vuelve al programa o revisa novedades."
              : "Si todavía no tienes acceso premium, puedes activar el acceso fundador o revisar los programas disponibles antes de comprar."}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
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
              href={activeProgram ? "/app/updates" : "/app/programas"}
              className="inline-flex justify-center rounded-md border border-neutral-700 bg-neutral-950 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-neutral-500"
            >
              {activeProgram ? "Ver novedades" : "Ver programas"}
            </Link>
          </div>
        </WorkspaceCard>

        <WorkspaceCard className="p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Contacto real
          </p>
          <h2 className="mt-3 text-2xl font-semibold leading-tight text-white">
            Escríbenos si necesitas revisión manual
          </h2>
          <p className="mt-3 text-sm leading-7 text-neutral-400">
            Si ya pagaste y no ves tu acceso, escribe desde el mismo correo con
            el que entras a Builder. Incluye qué compraste y qué estás viendo en
            tu dashboard para revisar más rápido.
          </p>
          <div className="mt-5 rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
              Correo de soporte
            </p>
            <p className="mt-2 break-all text-sm font-semibold text-white">
              {supportEmail}
            </p>
          </div>
          <a
            href={buildSupportMailto(user.email)}
            className="mt-5 inline-flex rounded-md bg-teal-300 px-4 py-2 text-sm font-semibold text-neutral-950 shadow-lg shadow-teal-950/40 transition hover:-translate-y-0.5 hover:bg-teal-200"
          >
            Escribir a soporte
          </a>
        </WorkspaceCard>
      </section>
    </div>
  );
}
