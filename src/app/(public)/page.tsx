import Link from "next/link";

import { EarlyAccessForm } from "@/components/public/early-access-form";
import { LaunchCountdown } from "@/components/public/launch-countdown";
import { Reveal } from "@/components/public/reveal";
import { VideoShowcase } from "@/components/public/video-showcase";

const heroBullets = [
  "Construye con OpenAI, Anthropic y Gemini",
  "Primer programa: IdeaCash HeredIA",
  "Precio fundador activo: USD 47",
];

const earlyBenefits = [
  "Acceso prioritario al lanzamiento",
  "Precio fundador reservado",
  "Aviso del lanzamiento en vivo",
];

const builderPoints = [
  ["Entorno privado", "Un espacio cerrado para aprender con foco."],
  ["Programas guiados", "Rutas claras desde arquitectura hasta producto."],
  ["Continuidad", "Siguiente paso, progreso y contexto."],
  ["Updates del build", "Nuevas piezas dentro del mismo sistema."],
  ["Soporte centralizado", "Acceso, compra y ayuda en un solo lugar."],
];

const programBullets = [
  "Replica la app desde cero",
  "Conecta OpenAI, Anthropic y Gemini",
  "Entiende la lógica Multi-IA del producto",
  "Sigue el build con updates privados",
];

const finalReinforcements = [
  "Compra hoy por USD 47",
  "Explora como invitado con Google",
  "Lanzamiento oficial en vivo",
  "Acceso temprano si prefieres esperar",
];

function BuyCta({ children }: { children: string }) {
  return (
    <Link
      href="/registro"
      className="group inline-flex min-h-12 items-center justify-center rounded-md bg-teal-300 px-5 py-3 text-sm font-semibold text-neutral-950 shadow-lg shadow-teal-950/40 transition duration-300 hover:-translate-y-0.5 hover:bg-teal-200 hover:shadow-teal-900/50"
    >
      <span>{children}</span>
      <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
        →
      </span>
    </Link>
  );
}

function ExploreCta({ children }: { children: string }) {
  return (
    <Link
      href="/login"
      className="inline-flex min-h-12 items-center justify-center rounded-md border border-teal-400/30 bg-teal-400/10 px-5 py-3 text-sm font-semibold text-teal-100 transition duration-300 hover:-translate-y-0.5 hover:border-teal-300/60 hover:bg-teal-400/15"
    >
      {children}
    </Link>
  );
}

function EarlyAccessCta({ children }: { children: string }) {
  return (
    <a
      href="#acceso-temprano"
      className="inline-flex min-h-11 items-center justify-center rounded-md border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm font-semibold text-neutral-300 transition duration-300 hover:-translate-y-0.5 hover:border-neutral-600 hover:text-white"
    >
      {children}
    </a>
  );
}

function ProgramCta({ children }: { children: string }) {
  return (
    <Link
      href="/programas/build-ideacash"
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

export default function HomePage() {
  return (
    <div className="relative left-1/2 -my-10 w-screen -translate-x-1/2 bg-neutral-950 text-white sm:-my-14">
      <section className="border-b border-neutral-800">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1fr_0.82fr] lg:px-8 lg:py-24">
          <div className="flex flex-col justify-center">
            <Reveal>
              <div className="inline-flex w-fit rounded-full border border-teal-400/20 bg-teal-400/10 px-3 py-1 text-xs font-semibold uppercase text-teal-300">
                Precio fundador activo / apertura 16 mayo 2026
              </div>
              <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.04] text-white sm:text-5xl lg:text-6xl">
                Aprende a construir productos Multi-IA reales dentro del LMS
                oficial de Rodrigo HeredIA.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-300">
                Compra el acceso fundador por USD 47, entra con Google y empieza
                desde el entorno privado de Builder. También puedes explorar como
                invitado antes de decidir.
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

            <Reveal
              delay={320}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
            >
              <BuyCta>Comprar acceso ahora</BuyCta>
              <ExploreCta>Entrar y explorar</ExploreCta>
              <EarlyAccessCta>Unirme al acceso temprano</EarlyAccessCta>
            </Reveal>
          </div>

          <HeroSystemVisual />
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-8">
        <div className="flex flex-col justify-center">
          <SectionIntro
            title="Mira cómo se siente Builder"
            description="Un preview breve del LMS, el enfoque de aprendizaje y el primer build Multi-IA antes de entrar."
          />
          <Reveal delay={160} className="mt-6 flex flex-col gap-3 sm:flex-row">
            <BuyCta>Comprar acceso ahora</BuyCta>
            <ExploreCta>Entrar y explorar</ExploreCta>
          </Reveal>
        </div>
        <VideoShowcase />
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <Reveal>
          <div className="rounded-2xl border border-teal-400/30 bg-teal-400/10 p-6 shadow-2xl shadow-black/20">
            <p className="text-sm font-semibold uppercase text-teal-200">
              Precio fundador antes del lanzamiento
            </p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight text-white">
              USD 47 activo hasta la apertura
            </h2>
            <p className="mt-4 text-base leading-8 text-neutral-200">
              Compra hoy, entra con tu cuenta y queda listo para consumir Build
              IdeaCash dentro del LMS. Después del lanzamiento, el precio regular
              sube.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-teal-300/25 bg-neutral-950/70 p-4">
                <p className="text-xs font-semibold uppercase text-neutral-500">
                  Precio fundador hoy
                </p>
                <p className="mt-2 text-3xl font-semibold text-white">USD 47</p>
              </div>
              <div className="rounded-xl border border-neutral-800 bg-neutral-950/70 p-4">
                <p className="text-xs font-semibold uppercase text-neutral-500">
                  Precio regular después
                </p>
                <p className="mt-2 text-3xl font-semibold text-neutral-300">
                  USD 67
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <BuyCta>Comprar acceso ahora</BuyCta>
              <ExploreCta>Entrar y explorar</ExploreCta>
            </div>
          </div>
        </Reveal>
        <Reveal delay={140} className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl shadow-black/20">
          <LaunchCountdown />
          <div className="mt-5 grid gap-3 text-sm text-neutral-300">
            <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
              Sábado 16 de mayo de 2026: lanzamiento oficial en vivo
            </div>
            <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
              El precio fundador queda disponible antes de la apertura
            </div>
          </div>
        </Reveal>
      </section>

      <section className="border-y border-neutral-800 bg-neutral-900/70">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8">
          <SectionIntro
            title="El LMS oficial de Rodrigo HeredIA"
            description="Un entorno privado para aprender a construir productos Multi-IA con estructura, continuidad y criterio."
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
            description="El primer programa oficial: cómo nace, se estructura y evoluciona una app Multi-IA usable y vendible."
          />
          <Reveal delay={140} className="mt-7">
            <div className="flex flex-col gap-3 sm:flex-row">
              <BuyCta>Comprar acceso ahora</BuyCta>
              <ProgramCta>Ver el programa activo</ProgramCta>
            </div>
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
              title="Elige tu nivel de intención"
              description="Compra si ya estás listo, entra a explorar si quieres ver el sistema por dentro, o deja tus datos si todavía prefieres esperar."
            />
            <Reveal
              delay={120}
              className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
            >
              <BuyCta>Comprar acceso ahora</BuyCta>
              <ExploreCta>Entrar y explorar</ExploreCta>
              <EarlyAccessCta>Unirme al acceso temprano</EarlyAccessCta>
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

      <section
        id="acceso-temprano"
        className="border-t border-neutral-800 bg-neutral-900/70"
      >
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-6 lg:grid-cols-[0.84fr_1fr] lg:px-8">
          <div>
            <SectionIntro
              eyebrow="Tercera vía"
              title="¿Aún no quieres entrar? Únete al acceso temprano"
              description="Para indecisos reales: deja tus datos y recibe aviso del lanzamiento, precio fundador y entrada prioritaria sin crear cuenta todavía."
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
          <EarlyAccessForm source="home" />
        </div>
      </section>
    </div>
  );
}
