import Link from "next/link";

import { LaunchCountdown } from "@/components/public/launch-countdown";
import { Reveal } from "@/components/public/reveal";

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
  ["Entorno privado premium", "Una experiencia cerrada, enfocada y diseñada para aprender con continuidad."],
  ["Programas estructurados", "Rutas claras para avanzar desde arquitectura hasta producto usable."],
  ["Continuidad y progreso", "El sistema te indica dónde estás y cuál es el siguiente paso."],
  ["Updates del build", "Nuevas piezas del proceso dentro del mismo entorno de aprendizaje."],
  ["Soporte centralizado", "Acceso, compra y ayuda conectados en un solo producto privado."],
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
      className="group inline-flex min-h-12 items-center justify-center rounded-md bg-teal-300 px-5 py-3 text-sm font-semibold text-neutral-950 shadow-lg shadow-teal-950/40 transition duration-300 hover:-translate-y-0.5 hover:bg-teal-200 hover:shadow-teal-900/50"
    >
      <span>{children}</span>
      <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
        →
      </span>
    </a>
  );
}

function SecondaryCta({ children }: { children: string }) {
  return (
    <Link
      href="/programas/build-ideacash-founder-access"
      className="inline-flex min-h-12 items-center justify-center rounded-md border border-neutral-700 bg-neutral-950 px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:border-neutral-400 hover:bg-neutral-900"
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
    <Reveal className="max-w-3xl">
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
    </Reveal>
  );
}

function HeroSystemVisual() {
  return (
    <Reveal delay={160}>
      <div className="relative rounded-2xl border border-neutral-800 bg-neutral-900 p-3 shadow-2xl shadow-black/40 transition duration-500 hover:-translate-y-1 hover:border-neutral-700">
        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase text-teal-300">
                Rodrigo HeredIA LMS
              </p>
              <p className="mt-1 text-sm font-semibold text-white">
                Builder.rodriheredia.com
              </p>
            </div>
            <span className="rounded-md border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 text-xs font-semibold text-amber-300">
              Pre-lanzamiento
            </span>
          </div>

          <div className="mt-6 grid gap-3">
            {[
              ["Primer programa", "Build IdeaCash — Founder Access"],
              ["Sistema", "OpenAI + Anthropic + Gemini"],
              ["Apertura", "Sábado 16 de mayo de 2026"],
            ].map(([label, value], index) => (
              <div
                key={label}
                className="rounded-lg border border-neutral-800 bg-neutral-900 p-4 transition duration-300 hover:border-teal-400/40"
                style={{ transitionDelay: `${index * 40}ms` }}
              >
                <p className="text-xs font-semibold uppercase text-neutral-500">
                  {label}
                </p>
                <p className="mt-1 text-sm font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-lg border border-teal-400/20 bg-teal-400/10 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-teal-100">
                Acceso fundador
              </p>
              <p className="text-sm font-semibold text-white">USD 47</p>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-neutral-800">
              <div className="h-full w-2/5 rounded-full bg-teal-300" />
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function VideoShowcase() {
  return (
    <Reveal delay={140}>
      <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 p-4 shadow-2xl shadow-black/40 transition duration-500 hover:-translate-y-1 hover:border-teal-400/30">
        <div className="absolute inset-x-8 top-6 h-24 rounded-full bg-teal-300/10 blur-3xl" />

        <div className="relative grid gap-5 lg:grid-cols-[0.78fr_1fr] lg:items-center">
          <div className="order-2 rounded-xl border border-neutral-800 bg-neutral-950 p-4 lg:order-1">
            <p className="text-xs font-semibold uppercase text-teal-300">
              Preview real del LMS
            </p>
            <h3 className="mt-3 text-2xl font-semibold leading-tight text-white">
              Una pieza vertical para sentir el producto antes de entrar.
            </h3>
            <p className="mt-3 text-sm leading-7 text-neutral-400">
              Vista de prueba del entorno Builder: contenido, foco y sensación
              de producto privado en formato mobile-first.
            </p>
            <div className="mt-5 grid gap-2 text-xs font-semibold uppercase text-neutral-500">
              <span className="rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2">
                Autoplay silencioso
              </span>
              <span className="rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2">
                Builder LMS / preview
              </span>
            </div>
          </div>

          <div className="order-1 mx-auto w-full max-w-[22rem] lg:order-2">
            <div className="rounded-[2rem] border border-neutral-700 bg-neutral-950 p-2 shadow-2xl shadow-teal-950/20">
              <div className="relative aspect-[9/16] overflow-hidden rounded-[1.55rem] border border-neutral-800 bg-black">
                <video
                  src="/video/builder-preview.mp4"
                  className="h-full w-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-label="Vista previa vertical de Builder HeredIA"
                />
                <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent p-4">
                  <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase text-white backdrop-blur">
                    Builder preview
                  </span>
                  <span className="h-2 w-2 rounded-full bg-teal-300 shadow-lg shadow-teal-300/50" />
                </div>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-4">
                  <p className="text-sm font-semibold text-white">
                    IdeaCash HeredIA
                  </p>
                  <p className="mt-1 text-xs text-neutral-300">
                    Primer programa del LMS oficial
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function EarlyAccessForm() {
  return (
    <Reveal delay={120}>
      <form className="rounded-2xl border border-teal-400/20 bg-neutral-950 p-5 shadow-2xl shadow-black/30">
        <div className="mb-5 rounded-xl border border-neutral-800 bg-neutral-900 p-4">
          <p className="text-xs font-semibold uppercase text-teal-300">
            Lista prioritaria
          </p>
          <p className="mt-2 text-lg font-semibold text-white">
            Reserva tu lugar de entrada al primer programa.
          </p>
          <p className="mt-2 text-sm leading-6 text-neutral-400">
            Deja tus datos para quedar en la lista de aviso prioritario cuando
            se habilite la apertura oficial.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-neutral-300">Nombre</span>
            <input
              name="name"
              placeholder="Tu nombre"
              className="h-12 w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 text-sm text-white outline-none transition duration-300 placeholder:text-neutral-600 focus:border-teal-300 focus:bg-neutral-950"
            />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-neutral-300">Email</span>
            <input
              name="email"
              type="email"
              placeholder="tu@email.com"
              className="h-12 w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 text-sm text-white outline-none transition duration-300 placeholder:text-neutral-600 focus:border-teal-300 focus:bg-neutral-950"
            />
          </label>
        </div>
        <Link
          href="/registro"
          className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-md bg-teal-300 px-5 py-3 text-sm font-semibold text-neutral-950 shadow-lg shadow-teal-950/40 transition duration-300 hover:-translate-y-0.5 hover:bg-teal-200"
        >
          Quiero acceso temprano
        </Link>
      </form>
    </Reveal>
  );
}

export default function HomePage() {
  return (
    <div className="relative left-1/2 -my-10 w-screen -translate-x-1/2 bg-neutral-950 text-white sm:-my-14">
      <section className="border-b border-neutral-800">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1fr_0.82fr] lg:px-8 lg:py-24">
          <div className="flex flex-col justify-center">
            <Reveal>
              <div className="inline-flex w-fit rounded-full border border-teal-400/20 bg-teal-400/10 px-3 py-1 text-xs font-semibold uppercase text-teal-300">
                LMS oficial de Rodrigo HeredIA / apertura 16 mayo 2026
              </div>
              <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.04] text-white sm:text-5xl lg:text-6xl">
                Aprende a construir productos Multi-IA reales dentro del LMS
                oficial de Rodrigo HeredIA.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-300">
                Builder.rodriheredia.com es el espacio donde aprenderás cómo
                diseño, conecto y convierto múltiples IAs en productos reales,
                empezando con IdeaCash HeredIA.
              </p>
            </Reveal>

            <div className="mt-7 grid gap-3 text-sm text-neutral-200">
              {heroBullets.map((item, index) => (
                <Reveal key={item} delay={80 + index * 70}>
                  <div className="rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-3 transition duration-300 hover:-translate-y-0.5 hover:border-teal-400/40">
                    {item}
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={320} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <PrimaryCta>Unirme al acceso temprano</PrimaryCta>
              <SecondaryCta>Ver el programa activo</SecondaryCta>
            </Reveal>
          </div>

          <HeroSystemVisual />
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-8">
        <div className="flex flex-col justify-center">
          <SectionIntro
            title="Mira primero cómo enseño a construir"
            description="En este video te explico qué es Builder.rodriheredia.com, qué vas a aprender dentro, por qué empecé con IdeaCash HeredIA y por qué este espacio no está diseñado para consumir contenido suelto, sino para aprender a crear productos Multi-IA reales."
          />
          <Reveal delay={160} className="mt-6">
            <PrimaryCta>Quiero acceso temprano</PrimaryCta>
          </Reveal>
        </div>
        <VideoShowcase />
      </section>

      <section
        id="acceso-temprano"
        className="border-y border-neutral-800 bg-neutral-900/70"
      >
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-6 lg:grid-cols-[0.84fr_1fr] lg:px-8">
          <div>
            <SectionIntro
              eyebrow="Acceso temprano"
              title="Únete al acceso temprano"
              description="El primer programa de Builder.rodriheredia.com se abrirá el sábado 16 de mayo de 2026. Regístrate temprano para recibir acceso prioritario, precio fundador y el aviso del lanzamiento oficial en vivo."
            />
            <div className="mt-7 grid gap-3">
              {earlyBenefits.map((benefit, index) => (
                <Reveal key={benefit} delay={index * 90}>
                  <div className="rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm font-medium text-neutral-200 transition duration-300 hover:border-teal-400/40">
                    {benefit}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <EarlyAccessForm />
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <Reveal>
          <div className="rounded-2xl border border-teal-400/30 bg-teal-400/10 p-6 shadow-2xl shadow-black/20">
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
              Regístrate antes del lanzamiento para entrar con prioridad y
              asegurar el precio fundador de apertura.
            </p>
            <div className="mt-6">
              <PrimaryCta>Quiero acceso temprano</PrimaryCta>
            </div>
          </div>
        </Reveal>
        <Reveal delay={140} className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl shadow-black/20">
          <LaunchCountdown />
          <div className="mt-5 grid gap-3 text-sm text-neutral-300">
            <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
              Lanzamiento oficial en vivo
            </div>
            <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
              Precio fundador reservado
            </div>
          </div>
        </Reveal>
      </section>

      <section className="border-y border-neutral-800 bg-neutral-900/70">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8">
          <SectionIntro
            title="Un entorno para aprender a construir, no solo para consumir contenido"
            description="Builder.rodriheredia.com es el LMS oficial de Rodrigo HeredIA. Aquí no entrarás a una carpeta suelta ni a una academia genérica. Entrarás a un entorno privado diseñado para aprender cómo se construyen productos Multi-IA reales con estructura, continuidad y criterio."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {builderPoints.map(([title, description], index) => (
              <Reveal key={title} delay={index * 70}>
                <div className="h-full rounded-xl border border-neutral-800 bg-neutral-950 p-4 transition duration-300 hover:-translate-y-1 hover:border-teal-400/40">
                  <p className="text-sm font-semibold leading-6 text-white">
                    {title}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-neutral-500">
                    {description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <SectionIntro
            eyebrow="Programa activo ahora"
            title="Build IdeaCash — Founder Access"
            description="Este será el primer programa oficial dentro de Builder.rodriheredia.com. Está diseñado para mostrarte cómo nace, se estructura y evoluciona un producto Multi-IA real, entendiendo cómo conectar OpenAI, Anthropic y Gemini dentro de una app usable y vendible."
          />
          <Reveal delay={140} className="mt-7">
            <SecondaryCta>Ver el programa activo</SecondaryCta>
          </Reveal>
        </div>
        <div className="grid gap-3">
          {programBullets.map((bullet, index) => (
            <Reveal key={bullet} delay={index * 80}>
              <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5 text-sm font-medium text-neutral-100 shadow-xl shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-teal-400/40">
                {bullet}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-neutral-800">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-6 lg:grid-cols-[1fr_0.8fr] lg:px-8">
          <div>
            <SectionIntro
              title="Reserva tu lugar antes de la apertura"
              description="El primer programa abrirá oficialmente el sábado 16 de mayo de 2026. Si te unes ahora al acceso temprano, quedarás en la lista prioritaria para entrar con precio fundador y recibir el aviso del lanzamiento en vivo."
            />
            <Reveal delay={120} className="mt-7 flex flex-col gap-3 sm:flex-row">
              <PrimaryCta>Quiero acceso temprano</PrimaryCta>
              <SecondaryCta>Ver el programa activo</SecondaryCta>
            </Reveal>
          </div>
          <div className="grid gap-3">
            {finalReinforcements.map((item, index) => (
              <Reveal key={item} delay={index * 70}>
                <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4 text-sm font-medium text-neutral-200 transition duration-300 hover:border-teal-400/40">
                  {item}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
