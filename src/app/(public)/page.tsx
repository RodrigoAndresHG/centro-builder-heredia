import Link from "next/link";

import { LaunchCountdown } from "@/components/public/launch-countdown";

const heroBullets = [
  "Aprende a construir con OpenAI, Anthropic y Gemini",
  "Accede al primer programa del LMS: IdeaCash HeredIA",
  "Regístrate temprano para recibir acceso prioritario y precio fundador",
];

const earlyBenefits = [
  "Acceso prioritario al lanzamiento",
  "Precio fundador reservado",
  "Aviso del lanzamiento en vivo",
];

const builderPoints = [
  "Entorno privado premium",
  "Programas estructurados",
  "Continuidad y progreso",
  "Updates del build",
  "Soporte y acceso centralizado",
];

const programBullets = [
  "Replica la app desde cero",
  "Entiende la lógica Multi-IA detrás del producto",
  "Aprende cómo conectar OpenAI, Anthropic y Gemini",
  "Sigue el build dentro de un entorno privado con continuidad y updates",
];

const finalReinforcements = [
  "Precio fundador de apertura: USD 47",
  "Acceso prioritario antes de la subida de precio",
  "Lanzamiento oficial en vivo",
  "Primer programa dentro del LMS oficial de Rodrigo HeredIA",
];

function PrimaryCta({ children }: { children: string }) {
  return (
    <a
      href="#acceso-temprano"
      className="inline-flex min-h-11 items-center justify-center rounded-md bg-teal-400 px-5 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-teal-300"
    >
      {children}
    </a>
  );
}

function SecondaryCta({ children }: { children: string }) {
  return (
    <Link
      href="/programas/build-ideacash-founder-access"
      className="inline-flex min-h-11 items-center justify-center rounded-md border border-neutral-700 bg-neutral-900 px-5 py-3 text-sm font-semibold text-white transition hover:border-neutral-500"
    >
      {children}
    </Link>
  );
}

function SectionIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? (
        <p className="mb-3 text-sm font-semibold uppercase text-teal-300">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-8 text-neutral-300">{description}</p>
      ) : null}
    </div>
  );
}

function VideoPlaceholder() {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-3 shadow-2xl shadow-black/30">
      <div className="aspect-video rounded-lg border border-neutral-800 bg-neutral-950 p-5">
        <div className="flex h-full flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="rounded-md bg-teal-400/10 px-3 py-1 text-xs font-semibold text-teal-300">
              Video principal
            </span>
            <span className="text-xs font-semibold text-neutral-500">
              Builder LMS
            </span>
          </div>
          <div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-teal-400/40 bg-teal-400/10 text-lg font-semibold text-teal-200">
              Play
            </div>
            <h3 className="mt-5 text-2xl font-semibold text-white">
              Presentación de Builder.rodriheredia.com
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-neutral-300">
              Espacio preparado para insertar el video oficial del lanzamiento.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function EarlyAccessForm() {
  return (
    <form className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm font-semibold text-neutral-300">Nombre</span>
          <input
            name="name"
            placeholder="Tu nombre"
            className="h-11 w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:border-teal-400"
          />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-semibold text-neutral-300">Email</span>
          <input
            name="email"
            type="email"
            placeholder="tu@email.com"
            className="h-11 w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:border-teal-400"
          />
        </label>
      </div>
      <Link
        href="/registro"
        className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-md bg-teal-400 px-5 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-teal-300"
      >
        Quiero acceso temprano
      </Link>
      <p className="mt-3 text-xs leading-5 text-neutral-500">
        Formulario visual preparado para conectar captura real de leads en la
        siguiente fase. Por ahora, el CTA lleva al registro existente.
      </p>
    </form>
  );
}

function LmsPreview() {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4 shadow-2xl shadow-black/30">
      <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-teal-300">
              Rodrigo HeredIA LMS
            </p>
            <p className="mt-1 text-sm font-semibold text-white">
              Build IdeaCash — Founder Access
            </p>
          </div>
          <span className="rounded-md bg-amber-400/10 px-2.5 py-1 text-xs font-semibold text-amber-300">
            Pre-lanzamiento
          </span>
        </div>

        <div className="mt-5 grid gap-3">
          {["IdeaCash HeredIA", "Multi-IA", "OpenAI + Anthropic + Gemini"].map(
            (item) => (
              <div
                key={item}
                className="rounded-md border border-neutral-800 bg-neutral-900 px-3 py-3 text-sm text-neutral-300"
              >
                {item}
              </div>
            ),
          )}
        </div>

        <div className="mt-5 h-2 overflow-hidden rounded-full bg-neutral-800">
          <div className="h-full w-1/3 rounded-full bg-teal-400" />
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="relative left-1/2 -my-10 w-screen -translate-x-1/2 bg-neutral-950 text-white sm:-my-14">
      <section className="border-b border-neutral-800">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-6 sm:py-18 lg:grid-cols-[1fr_0.85fr] lg:px-8 lg:py-20">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase text-teal-300">
              LMS oficial de Rodrigo HeredIA
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
              Aprende a construir productos Multi-IA reales dentro del LMS oficial
              de Rodrigo HeredIA.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-300">
              Builder.rodriheredia.com es el espacio donde aprenderás cómo
              diseño, conecto y convierto múltiples IAs en productos reales,
              empezando con IdeaCash HeredIA. El primer programa abre el sábado
              16 de mayo de 2026.
            </p>

            <div className="mt-7 grid gap-3 text-sm text-neutral-200">
              {heroBullets.map((item) => (
                <div
                  key={item}
                  className="rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-3"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <PrimaryCta>Unirme al acceso temprano</PrimaryCta>
              <SecondaryCta>Ver el programa activo</SecondaryCta>
            </div>
          </div>

          <LmsPreview />
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div>
          <SectionIntro
            title="Mira primero cómo enseño a construir"
            description="En este video te explico qué es Builder.rodriheredia.com, qué vas a aprender dentro, por qué empecé con IdeaCash HeredIA y por qué este espacio no está diseñado para consumir contenido suelto, sino para aprender a crear productos Multi-IA reales."
          />
          <div className="mt-6">
            <PrimaryCta>Quiero acceso temprano</PrimaryCta>
          </div>
        </div>
        <VideoPlaceholder />
      </section>

      <section
        id="acceso-temprano"
        className="border-y border-neutral-800 bg-neutral-900/70"
      >
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-6 lg:grid-cols-[0.85fr_1fr] lg:px-8">
          <div>
            <SectionIntro
              eyebrow="Acceso temprano"
              title="Únete al acceso temprano"
              description="El primer programa de Builder.rodriheredia.com se abrirá el sábado 16 de mayo de 2026. Regístrate temprano para recibir acceso prioritario, precio fundador y el aviso del lanzamiento oficial en vivo."
            />
            <div className="mt-6 grid gap-3">
              {earlyBenefits.map((benefit) => (
                <div
                  key={benefit}
                  className="rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm font-medium text-neutral-200"
                >
                  {benefit}
                </div>
              ))}
            </div>
          </div>
          <EarlyAccessForm />
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div className="rounded-xl border border-teal-400/30 bg-teal-400/10 p-6">
          <p className="text-sm font-semibold uppercase text-teal-200">
            Lanzamiento oficial del primer programa
          </p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight text-white">
            Sábado 16 de mayo de 2026
          </h2>
          <p className="mt-4 text-base leading-8 text-neutral-200">
            El sábado 16 de mayo de 2026 abriré oficialmente el primer programa
            de Builder.rodriheredia.com: IdeaCash HeredIA. Si te registras
            temprano, recibirás acceso prioritario, precio fundador y el aviso
            del lanzamiento en vivo.
          </p>
          <p className="mt-4 text-sm font-semibold text-teal-200">
            Regístrate antes del lanzamiento para entrar con prioridad y asegurar
            el precio fundador de apertura.
          </p>
          <div className="mt-6">
            <PrimaryCta>Quiero acceso temprano</PrimaryCta>
          </div>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
          <LaunchCountdown />
          <div className="mt-5 grid gap-3 text-sm text-neutral-300">
            <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
              Lanzamiento oficial en vivo
            </div>
            <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
              Precio fundador reservado
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-neutral-800 bg-neutral-900/70">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8">
          <SectionIntro
            title="Un entorno para aprender a construir, no solo para consumir contenido"
            description="Builder.rodriheredia.com es el LMS oficial de Rodrigo HeredIA. Aquí no entrarás a una carpeta suelta ni a una academia genérica. Entrarás a un entorno privado diseñado para aprender cómo se construyen productos Multi-IA reales con estructura, continuidad y criterio."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {builderPoints.map((point) => (
              <div
                key={point}
                className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 text-sm font-semibold leading-6 text-neutral-100"
              >
                {point}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase text-teal-300">
            Programa activo ahora
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
            Build IdeaCash — Founder Access
          </h2>
          <p className="mt-5 text-base leading-8 text-neutral-300">
            Este será el primer programa oficial dentro de
            Builder.rodriheredia.com. Está diseñado para mostrarte cómo nace, se
            estructura y evoluciona un producto Multi-IA real, entendiendo cómo
            conectar OpenAI, Anthropic y Gemini dentro de una app usable y
            vendible.
          </p>
          <div className="mt-7">
            <SecondaryCta>Ver el programa activo</SecondaryCta>
          </div>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
          <div className="grid gap-3">
            {programBullets.map((bullet) => (
              <div
                key={bullet}
                className="rounded-lg border border-neutral-800 bg-neutral-950 p-4 text-sm font-medium text-neutral-100"
              >
                {bullet}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-neutral-800">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-6 lg:grid-cols-[1fr_0.8fr] lg:px-8">
          <div>
            <SectionIntro
              title="Reserva tu lugar antes de la apertura"
              description="El primer programa abrirá oficialmente el sábado 16 de mayo de 2026. Si te unes ahora al acceso temprano, quedarás en la lista prioritaria para entrar con precio fundador y recibir el aviso del lanzamiento en vivo."
            />
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <PrimaryCta>Quiero acceso temprano</PrimaryCta>
              <SecondaryCta>Ver el programa activo</SecondaryCta>
            </div>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
            <div className="grid gap-3">
              {finalReinforcements.map((item) => (
                <div
                  key={item}
                  className="rounded-lg border border-neutral-800 bg-neutral-950 p-4 text-sm font-medium text-neutral-200"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
