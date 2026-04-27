import type { Metadata } from "next";
import Link from "next/link";

import { EarlyAccessForm } from "@/components/public/early-access-form";
import { LaunchCountdown } from "@/components/public/launch-countdown";
import { Reveal } from "@/components/public/reveal";

export const metadata: Metadata = {
  title: "Build IdeaCash — Founder Access | Builder HeredIA",
  description:
    "Aprende a replicar una app Multi-IA real desde cero dentro del LMS oficial de Rodrigo HeredIA.",
};

const heroBullets = [
  "Replica la app desde cero",
  "Entiende la lógica Multi-IA detrás del producto",
  "Aprende cómo conectar OpenAI, Anthropic y Gemini",
  "Sigue el build con continuidad y updates",
];

const learningPoints = [
  "Cómo convertir una idea en una app real",
  "Cómo conectar OpenAI, Anthropic y Gemini dentro del mismo sistema",
  "Cómo diseñar un flujo Multi-IA con criterio de producto",
  "Cómo recorrer el build completo dentro de un entorno privado",
];

const accessItems = [
  "Acceso privado dentro del LMS",
  "Módulos y lecciones estructuradas",
  "Updates del build",
  "Continuidad y progreso",
  "Soporte dentro de la plataforma",
];

const audienceProfiles = [
  "Builders que quieren crear algo real",
  "Profesionales que quieren conectar varias IAs dentro de un producto",
  "Creadores que quieren convertir ideas en activos reales",
  "Personas que valoran estructura, continuidad y criterio",
];

const launchBenefits = [
  "Acceso prioritario al primer programa del LMS",
  "Precio fundador reservado",
  "Aviso del lanzamiento en vivo",
  "Entrada temprana antes del siguiente aumento de precio",
];

const finalReinforcements = [
  "Precio fundador de apertura: USD 47",
  "Acceso prioritario antes de la subida de precio",
  "Lanzamiento oficial en vivo",
  "Primer programa dentro del LMS oficial de Rodrigo HeredIA",
];

function PrimaryCta({ children }: { children: string }) {
  return (
    <Link
      href="/#acceso-temprano"
      className="group inline-flex min-h-12 items-center justify-center rounded-md bg-teal-300 px-5 py-3 text-sm font-semibold text-neutral-950 shadow-lg shadow-teal-950/40 transition duration-300 hover:-translate-y-0.5 hover:bg-teal-200 hover:shadow-teal-900/50"
    >
      <span>{children}</span>
      <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
        →
      </span>
    </Link>
  );
}

function SecondaryCta({
  children,
  href,
}: {
  children: string;
  href: string;
}) {
  return (
    <Link
      href={href}
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
        <p className="mt-4 text-base leading-8 text-neutral-300">
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}

function ProgramSignal() {
  return (
    <Reveal delay={160}>
      <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 p-3 shadow-2xl shadow-black/40">
        <div className="absolute inset-x-8 top-8 h-24 rounded-full bg-teal-300/10 blur-3xl" />
        <div className="relative rounded-xl border border-neutral-800 bg-neutral-950 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase text-teal-300">
                Flagship program
              </p>
              <p className="mt-1 text-sm font-semibold text-white">
                Builder HeredIA LMS
              </p>
            </div>
            <span className="rounded-md border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 text-xs font-semibold text-amber-300">
              Founder Access
            </span>
          </div>

          <div className="mt-7 rounded-xl border border-neutral-800 bg-neutral-900 p-5">
            <p className="text-xs font-semibold uppercase text-neutral-500">
              Producto base
            </p>
            <h3 className="mt-3 text-2xl font-semibold leading-tight text-white">
              IdeaCash HeredIA
            </h3>
            <p className="mt-3 text-sm leading-7 text-neutral-400">
              Una app Multi-IA real como objeto de aprendizaje, arquitectura y
              ejecución.
            </p>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {["OpenAI", "Anthropic", "Gemini", "Producto usable"].map(
              (item) => (
                <div
                  key={item}
                  className="rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-3 text-sm font-semibold text-neutral-200"
                >
                  {item}
                </div>
              ),
            )}
          </div>

          <div className="mt-5 rounded-xl border border-teal-400/20 bg-teal-400/10 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-teal-100">
                Precio fundador
              </p>
              <p className="text-xl font-semibold text-white">USD 47</p>
            </div>
            <p className="mt-2 text-xs leading-5 text-teal-100/80">
              Apertura oficial: sábado 16 de mayo de 2026
            </p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export default function BuildIdeaCashPage() {
  return (
    <div className="relative left-1/2 -my-10 w-screen -translate-x-1/2 bg-neutral-950 text-white sm:-my-14">
      <section className="border-b border-neutral-800">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1fr_0.78fr] lg:px-8 lg:py-24">
          <div className="flex flex-col justify-center">
            <Reveal>
              <div className="inline-flex w-fit rounded-full border border-teal-400/20 bg-teal-400/10 px-3 py-1 text-xs font-semibold uppercase text-teal-300">
                Primer programa oficial / pre-lanzamiento
              </div>
              <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.04] text-white sm:text-5xl lg:text-6xl">
                Build IdeaCash — Founder Access
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-300">
                Aprende a replicar una app Multi-IA real desde cero,
                entendiendo cómo conecto OpenAI, Anthropic y Gemini dentro de
                un producto usable, estructurado y vendible.
              </p>
              <p className="mt-4 max-w-2xl text-base leading-8 text-neutral-400">
                Este será el primer programa oficial dentro de
                Builder.rodriheredia.com. Abrirá el sábado 16 de mayo de 2026.
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

            <Reveal delay={360} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <PrimaryCta>Unirme al acceso temprano</PrimaryCta>
              <SecondaryCta href="#incluye">Ver qué incluye</SecondaryCta>
            </Reveal>
          </div>

          <ProgramSignal />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8">
        <SectionIntro
          eyebrow="Qué vas a aprender"
          title="Qué vas a aprender dentro de Build IdeaCash"
          description="Este programa no está diseñado para que solo veas una app terminada. Está diseñado para que entiendas cómo pensarla, estructurarla y replicarla desde cero usando lógica real de producto Multi-IA."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {learningPoints.map((point, index) => (
            <Reveal key={point} delay={index * 70}>
              <div className="h-full rounded-xl border border-neutral-800 bg-neutral-900 p-5 shadow-xl shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-teal-400/40">
                <p className="text-xs font-semibold uppercase text-neutral-500">
                  0{index + 1}
                </p>
                <p className="mt-4 text-sm font-semibold leading-6 text-white">
                  {point}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section
        id="incluye"
        className="border-y border-neutral-800 bg-neutral-900/70"
      >
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-6 lg:grid-cols-[0.82fr_1fr] lg:px-8">
          <div>
            <SectionIntro
              eyebrow="Qué incluye"
              title="Qué incluye el acceso"
              description="Build IdeaCash — Founder Access no te da solo videos. Te da entrada al entorno privado donde seguirás el programa, avanzarás con continuidad y verás el build dentro de una experiencia más clara y seria."
            />
          </div>
          <div className="grid gap-3">
            {accessItems.map((item, index) => (
              <Reveal key={item} delay={index * 70}>
                <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 text-sm font-medium text-neutral-200 transition duration-300 hover:border-teal-400/40">
                  {item}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <SectionIntro
            eyebrow="Para quién"
            title="Para quién es este programa"
            description="Build IdeaCash — Founder Access está pensado para personas que no quieren quedarse solo viendo herramientas sueltas. Está diseñado para quienes quieren construir con criterio, estructura y visión de ejecución."
          />
          <Reveal delay={160}>
            <p className="mt-6 rounded-xl border border-teal-400/20 bg-teal-400/10 p-5 text-sm font-semibold leading-7 text-teal-100">
              No necesitas llegar con todo resuelto. Pero sí con ganas reales
              de aprender a construir mejor.
            </p>
          </Reveal>
        </div>
        <div className="grid gap-3">
          {audienceProfiles.map((profile, index) => (
            <Reveal key={profile} delay={index * 80}>
              <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5 text-sm font-medium text-neutral-100 shadow-xl shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-teal-400/40">
                {profile}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-neutral-800 bg-neutral-900/70">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <Reveal>
            <div className="rounded-2xl border border-teal-400/30 bg-teal-400/10 p-6 shadow-2xl shadow-black/20">
              <p className="text-sm font-semibold uppercase text-teal-200">
                Estado de lanzamiento
              </p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight text-white">
                Apertura oficial: sábado 16 de mayo de 2026
              </h2>
              <p className="mt-4 text-base leading-8 text-neutral-200">
                Build IdeaCash — Founder Access abrirá oficialmente dentro de
                Builder.rodriheredia.com. Hasta entonces, puedes registrarte
                para recibir acceso prioritario, precio fundador y el aviso del
                lanzamiento oficial en vivo.
              </p>
              <div className="mt-6 rounded-xl border border-neutral-800 bg-neutral-950 p-4">
                <p className="text-sm font-semibold text-white">
                  Precio fundador de apertura: USD 47
                </p>
                <p className="mt-2 text-xs leading-5 text-neutral-500">
                  Este precio de apertura no representa el precio final del
                  programa a medida que el sistema y el contenido sigan
                  creciendo.
                </p>
              </div>
              <div className="mt-6">
                <PrimaryCta>Unirme al acceso temprano</PrimaryCta>
              </div>
            </div>
          </Reveal>

          <div className="grid gap-4">
            <EarlyAccessForm source="program_build_ideacash" />
            <Reveal
              delay={120}
              className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6 shadow-2xl shadow-black/20"
            >
              <LaunchCountdown />
            </Reveal>
            <div className="grid gap-3 sm:grid-cols-2">
              {launchBenefits.map((benefit, index) => (
                <Reveal key={benefit} delay={index * 70}>
                  <div className="h-full rounded-xl border border-neutral-800 bg-neutral-950 p-4 text-sm font-medium text-neutral-200 transition duration-300 hover:border-teal-400/40">
                    {benefit}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-neutral-800">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-6 lg:grid-cols-[1fr_0.8fr] lg:px-8">
          <div>
            <SectionIntro
              title="Reserva tu lugar antes de la apertura"
              description="Build IdeaCash — Founder Access abrirá oficialmente el sábado 16 de mayo de 2026. Si te unes ahora al acceso temprano, quedarás en la lista prioritaria para entrar con precio fundador y recibir el aviso del lanzamiento en vivo."
            />
            <Reveal delay={120} className="mt-7 flex flex-col gap-3 sm:flex-row">
              <PrimaryCta>Quiero acceso temprano</PrimaryCta>
              <SecondaryCta href="/">Volver al LMS</SecondaryCta>
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
