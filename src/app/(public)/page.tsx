import Link from "next/link";

import { EarlyAccessForm } from "@/components/public/early-access-form";
import { Reveal } from "@/components/public/reveal";
import { VideoShowcase } from "@/components/public/video-showcase";

const heroBullets = [
  "Construido en vivo, paso a paso, sin relleno",
  "Conecta IA real: OpenAI, Anthropic y Gemini",
  "Te llevas el agente funcionando, no solo teoría",
];

type ProgramCardData = {
  badge: string;
  badgeTone: "free" | "live" | "flagship";
  name: string;
  description: string;
  price: string;
  priceNote: string;
  href: string;
  cta: string;
};

const programs: ProgramCardData[] = [
  {
    badge: "Gratis",
    badgeTone: "free",
    name: "Claude desde Cero",
    description:
      "Tu punto de entrada al ecosistema. Aprende a usar Claude con criterio, desde cero y sin costo.",
    price: "Gratis",
    priceNote: "Empieza hoy sin tarjeta",
    href: "/registro?intent=explore",
    cta: "Empezar gratis",
  },
  {
    badge: "El del Live",
    badgeTone: "live",
    name: "Crea tu Agente de Noticias de IA en 1 Hora",
    description:
      "El programa que construí en vivo en TikTok. Llévate el paso a paso completo para dejar tu agente funcionando a tu ritmo.",
    price: "USD 9.99",
    priceNote: "Pago único · acceso inmediato",
    href: "/registro?intent=buy",
    cta: "Obtener el programa",
  },
  {
    badge: "Programa insignia",
    badgeTone: "flagship",
    name: "Builder Multi-IA",
    description:
      "El recorrido completo para construir productos Multi-IA reales, módulo a módulo, con contenido nuevo cada semana.",
    price: "USD 47",
    priceNote: "Acceso al programa completo",
    href: "/registro?intent=buy",
    cta: "Activar acceso",
  },
];

const builderPoints = [
  ["Entorno privado", "Un espacio cerrado para aprender con foco."],
  ["Programas guiados", "Rutas claras desde la idea hasta el producto."],
  ["Continuidad", "Siguiente paso, progreso y contexto guardados."],
  ["Updates del build", "Nuevas piezas dentro del mismo sistema."],
  ["Canal de WhatsApp", "Novedades, módulos y Lives directo en tu WhatsApp."],
];

const liveHighlights = [
  "Conectar la IA y traer noticias reales",
  "Dejar el agente funcionando, paso a paso",
  "El recorrido completo, sin relleno",
];

function BuyCta({ children }: { children: string }) {
  return (
    <Link
      href="/registro?intent=buy"
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
      href="/registro?intent=explore"
      className="inline-flex min-h-12 items-center justify-center rounded-md border border-teal-400/30 bg-teal-400/10 px-5 py-3 text-sm font-semibold text-teal-100 transition duration-300 hover:-translate-y-0.5 hover:border-teal-300/60 hover:bg-teal-400/15"
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

const badgeToneClass: Record<ProgramCardData["badgeTone"], string> = {
  free: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  live: "border-teal-300/40 bg-teal-300/15 text-teal-100",
  flagship: "border-amber-400/30 bg-amber-400/10 text-amber-200",
};

function ProgramCard({ program }: { program: ProgramCardData }) {
  const isLive = program.badgeTone === "live";

  return (
    <div
      className={`flex h-full flex-col rounded-2xl border p-6 shadow-xl shadow-black/10 transition duration-300 hover:-translate-y-1 ${
        isLive
          ? "border-teal-400/40 bg-teal-400/10 hover:border-teal-300/60"
          : "border-neutral-800 bg-neutral-900 hover:border-teal-400/40"
      }`}
    >
      <span
        className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${badgeToneClass[program.badgeTone]}`}
      >
        {program.badge}
      </span>
      <h3 className="mt-4 text-xl font-semibold leading-tight text-white">
        {program.name}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-7 text-neutral-300">
        {program.description}
      </p>
      <div className="mt-5">
        <p className="text-2xl font-semibold text-white">{program.price}</p>
        <p className="mt-1 text-xs text-neutral-500">{program.priceNote}</p>
      </div>
      <Link
        href={program.href}
        className={`mt-5 inline-flex min-h-11 items-center justify-center rounded-md px-4 py-2.5 text-sm font-semibold transition duration-300 hover:-translate-y-0.5 ${
          isLive
            ? "bg-teal-300 text-neutral-950 shadow-lg shadow-teal-950/40 hover:bg-teal-200"
            : "border border-neutral-700 bg-neutral-950 text-white hover:border-neutral-400"
        }`}
      >
        {program.cta}
      </Link>
    </div>
  );
}

function FeaturedAgentCard() {
  return (
    <Reveal delay={160}>
      <div className="relative rounded-2xl border border-neutral-800 bg-neutral-900 p-3 shadow-2xl shadow-black/40">
        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-red-300">
                Construido en vivo · TikTok
              </p>
            </div>
            <span className="rounded-md border border-teal-400/20 bg-teal-400/10 px-2.5 py-1 text-xs font-semibold text-teal-200">
              Disponible ahora
            </span>
          </div>

          <h3 className="mt-4 text-lg font-semibold leading-tight text-white">
            Agente de Noticias con IA, paso a paso
          </h3>
          <p className="mt-2 text-sm leading-6 text-neutral-400">
            Lo construí en vivo en TikTok. Llévate el recorrido completo a tu
            ritmo.
          </p>

          <div className="mt-5 grid gap-2">
            {liveHighlights.map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-200"
              >
                <span className="text-teal-300">✓</span>
                {item}
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-neutral-800 pt-4">
            <span className="text-xl font-semibold text-white">USD 9.99</span>
            <Link
              href="/registro?intent=buy"
              className="inline-flex items-center gap-2 rounded-md bg-teal-300 px-4 py-2 text-sm font-semibold text-neutral-950 transition hover:bg-teal-200"
            >
              Obtener
              <span>→</span>
            </Link>
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
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-red-300">
                <span className="flex h-2 w-2 rounded-full bg-red-500" />
                El programa de mi Live · Visto en TikTok
              </div>
              <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.04] text-white sm:text-5xl lg:text-6xl">
                Construye tu primer Agente de Noticias con IA.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-300">
                Lo construí en vivo en TikTok, paso a paso. ¿Te lo perdiste o
                quieres tenerlo completo y a tu ritmo? El recorrido entero está
                dentro del LMS oficial de Rodrigo HeredIA.
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
              <BuyCta>Obtener el programa · USD 9.99</BuyCta>
              <ExploreCta>Empezar gratis</ExploreCta>
            </Reveal>
            <Reveal delay={390}>
              <p className="mt-4 text-sm font-semibold text-neutral-400">
                Agente de Noticias de IA: USD 9.99 · pago único · acceso
                inmediato dentro del LMS
              </p>
            </Reveal>
          </div>

          <FeaturedAgentCard />
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-8">
        <div className="flex flex-col justify-center">
          <SectionIntro
            title="Mira cómo se siente el LMS por dentro"
            description="Un vistazo rápido al entorno, el ritmo de aprendizaje y la experiencia real antes de entrar."
          />
          <Reveal delay={160} className="mt-6 flex flex-col gap-3 sm:flex-row">
            <BuyCta>Obtener el programa</BuyCta>
            <ExploreCta>Empezar gratis</ExploreCta>
          </Reveal>
        </div>
        <VideoShowcase />
      </section>

      <section className="border-y border-neutral-800 bg-neutral-900/70">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8">
          <SectionIntro
            eyebrow="Ecosistema de programas"
            title="Elige por dónde empezar"
            description="Builder HeredIA crece como un ecosistema: empieza gratis, llévate el programa del Live, y profundiza con el recorrido completo. Cada semana se suma contenido nuevo."
          />
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {programs.map((program, index) => (
              <Reveal key={program.name} delay={index * 90}>
                <ProgramCard program={program} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8">
        <SectionIntro
          title="El LMS oficial de Rodrigo HeredIA"
          description="Un entorno privado para aprender a construir con IA con estructura, continuidad y criterio — no contenido suelto."
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
      </section>

      <section
        id="acceso-temprano"
        className="border-t border-neutral-800 bg-neutral-900/70"
      >
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-6 lg:grid-cols-[0.84fr_1fr] lg:px-8">
          <div>
            <SectionIntro
              eyebrow="Mantente al día"
              title="Recibe aviso de cada nuevo programa y Live"
              description="Déjame tu correo y te avisaré cuando abra un nuevo programa, módulo o Live. Sin spam, solo lo importante del ecosistema Builder."
            />
            <div className="mt-7 grid gap-3">
              {[
                "Aviso de nuevos programas y módulos",
                "Invitación a los próximos Lives",
                "Acceso temprano a lanzamientos",
              ].map((benefit, index) => (
                <Reveal key={benefit} delay={index * 90}>
                  <div className="rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm font-medium text-neutral-200 transition duration-300 hover:border-teal-400/40">
                    {benefit}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <EarlyAccessForm source="home" />
          <p className="text-sm font-medium text-neutral-500 lg:col-start-2">
            Sin compromiso. Solo te aviso de lo importante.
          </p>
        </div>
      </section>
    </div>
  );
}
