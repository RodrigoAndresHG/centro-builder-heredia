import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";

import { EarlyAccessForm } from "@/components/public/early-access-form";
import { Reveal } from "@/components/public/reveal";
import { VideoShowcase } from "@/components/public/video-showcase";
import { Hero } from "@/components/marketing/hero";

export const metadata: Metadata = {
  title: "Builder HeredIA | Aprende a construir apps Multi-IA reales",
  description:
    "El LMS oficial de Rodrigo HeredIA. Aprende a construir apps Multi-IA reales, paso a paso, conectando OpenAI, Anthropic y Gemini. Te llevas el agente funcionando.",
};

type LaneData = {
  n: string;
  title: string;
  description: string;
  icon: ReactNode;
  points: string[];
};

const lanes: LaneData[] = [
  {
    n: "01",
    title: "Entorno privado y guiado",
    description:
      "Un espacio cerrado con rutas claras, de la idea al producto. Tu progreso y tu contexto quedan guardados: retomas justo donde quedaste.",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <path d="M4 12l4 4 12-12" />
        <path d="M4 20h16" />
      </svg>
    ),
    points: [
      "Programas guiados, paso a paso",
      "Continuidad: retomas donde quedaste",
      "Sin ruido, con foco",
    ],
  },
  {
    n: "02",
    title: "Multi-IA de verdad",
    description:
      "Conectas OpenAI, Anthropic y Gemini dentro de apps reales. Sales con un agente funcionando en tus manos, no con teoría suelta.",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <path d="M12 2l8 3v7c0 5-4 8-8 10-4-2-8-5-8-10V5z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    points: [
      "OpenAI, Anthropic y Gemini",
      "Construido en vivo, sin relleno",
      "Te llevas el producto funcionando",
    ],
  },
  {
    n: "03",
    title: "Un ecosistema que crece",
    description:
      "Cada semana se suma contenido nuevo dentro del mismo sistema. Las novedades y los Lives te llegan directo a tu WhatsApp.",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <path d="M3 12h4l3 8 4-16 3 8h4" />
      </svg>
    ),
    points: [
      "Updates del build cada semana",
      "Nuevos módulos y programas",
      "Canal de WhatsApp con Lives",
    ],
  },
];

type ProgramTone = "free" | "live" | "flagship";

type ProgramData = {
  tag: string;
  tone: ProgramTone;
  name: string;
  description: string;
  price: string;
  priceNote: string;
  href: string;
  cta: string;
  flagship?: boolean;
};

const programs: ProgramData[] = [
  {
    tag: "Gratis",
    tone: "free",
    name: "Claude desde Cero",
    description:
      "Tu punto de entrada al ecosistema. Aprende a usar Claude con criterio, desde cero y sin costo.",
    price: "Gratis",
    priceNote: "Empieza hoy sin tarjeta",
    href: "/registro?intent=explore",
    cta: "Empezar gratis",
  },
  {
    tag: "El del Live",
    tone: "live",
    name: "Agente de Noticias de IA en 1 hora",
    description:
      "El programa que construí en vivo en TikTok. Llévate el paso a paso completo para dejar tu agente funcionando a tu ritmo.",
    price: "USD 9.99",
    priceNote: "Pago único · acceso inmediato",
    href: "/registro?intent=buy",
    cta: "Obtener el programa",
  },
  {
    tag: "Insignia",
    tone: "flagship",
    name: "Builder Multi-IA",
    description:
      "El recorrido completo para construir productos Multi-IA reales, módulo a módulo, con contenido nuevo cada semana.",
    price: "USD 47",
    priceNote: "Acceso al programa completo",
    href: "/registro?intent=buy",
    cta: "Activar acceso",
    flagship: true,
  },
];

const principles = [
  {
    n: "01",
    title: "Construido en vivo.",
    body: "Nada de teoría muerta. Ves cómo se arma de verdad, pieza por pieza, como en el Live.",
  },
  {
    n: "02",
    title: "Un paso a la vez.",
    body: "Cada lección deja algo funcionando. Avanzas sin perderte y sin saltos raros.",
  },
  {
    n: "03",
    title: "Te llevas el producto.",
    body: "Sales con un agente real corriendo en tus manos, no con apuntes que nunca vas a abrir.",
  },
  {
    n: "04",
    title: "Contenido nuevo cada semana.",
    body: "El LMS crece contigo: nuevos módulos y programas dentro del mismo acceso.",
  },
];

const earlyAccessBenefits = [
  "Aviso de nuevos programas y módulos",
  "Invitación a los próximos Lives",
  "Acceso temprano a cada lanzamiento",
];

const socials = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/rodrigoheredia",
    path: "M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 8.98h4v12H3v-12zM10 8.98h3.8v1.64h.05c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.78 2.65 4.78 6.1v6.32h-4v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96v5.7h-4v-12z",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@rodrigo_heredia_cio",
    path: "M16.6 5.82a4.28 4.28 0 01-2.5-3.82h-3.2v13.1a2.5 2.5 0 11-2.5-2.5c.26 0 .5.04.74.11V7.4a5.7 5.7 0 00-.74-.05 5.72 5.72 0 105.72 5.72V9.01a7.5 7.5 0 004.38 1.4V7.2a4.28 4.28 0 01-1.9-1.38z",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/rodrigo_heredia_cio",
    path: "M12 2.2c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92C2.21 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85C2.42 3.92 3.94 2.38 7.15 2.27 8.42 2.21 8.8 2.2 12 2.2zm0 3.3a6.5 6.5 0 100 13 6.5 6.5 0 000-13zm0 10.72a4.22 4.22 0 110-8.44 4.22 4.22 0 010 8.44zM18.9 4.55a1.52 1.52 0 100 3.04 1.52 1.52 0 000-3.04z",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/17AvHpUNoS/",
    path: "M22 12a10 10 0 10-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0022 12z",
  },
];

export default function LandingPage() {
  return (
    <main id="top">
      <Hero />

      {/* PROOF */}
      <section className="proof">
        <div className="wrap proof__inner">
          <span className="proof__label">Construido con IA real</span>
          <div className="proof__logos">
            <span>OpenAI</span>
            <span>Anthropic</span>
            <span>Gemini</span>
            <span>Next.js</span>
            <span>Stripe</span>
          </div>
        </div>
      </section>

      {/* LANES — qué incluye */}
      <section className="section-pad" id="incluye">
        <div className="wrap">
          <Reveal className="shead">
            <span className="eyebrow">Qué incluye</span>
            <h2>
              Un LMS para <b>construir de verdad</b>, no para acumular videos.
            </h2>
            <p>
              Builder HeredIA es un entorno privado con estructura, continuidad y
              criterio. Aprendes haciendo, con IA real y un producto al final.
            </p>
          </Reveal>
          <Reveal className="lanes" delay={120}>
            {lanes.map((lane) => (
              <div className="lane" key={lane.n}>
                <div className="lane__n">{lane.n}</div>
                <div className="lane__ico">{lane.icon}</div>
                <h3>{lane.title}</h3>
                <p>{lane.description}</p>
                <div className="lane__list">
                  {lane.points.map((point) => (
                    <span key={point}>{point}</span>
                  ))}
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* PREVIEW del LMS por dentro */}
      <section className="section-pad" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal className="shead">
            <span className="eyebrow">Por dentro</span>
            <h2>
              Mira cómo se siente <b>el LMS por dentro.</b>
            </h2>
            <p>
              Un vistazo al entorno, al ritmo y a la experiencia real antes de
              entrar.
            </p>
          </Reveal>
          <VideoShowcase />
        </div>
      </section>

      {/* PROGRAMAS */}
      <section className="section-pad" id="programas" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal className="shead">
            <span className="eyebrow">Ecosistema de programas</span>
            <h2>
              Elige <b>por dónde empezar.</b>
            </h2>
            <p>
              Empieza gratis, llévate el programa del Live y profundiza con el
              recorrido completo. Cada semana se suma contenido nuevo.
            </p>
          </Reveal>
          <Reveal className="eco" delay={120}>
            {programs.map((program) => (
              <div
                className={`ecocard${program.flagship ? " ecocard--flagship" : ""}`}
                key={program.name}
              >
                <div className="ecocard__top">
                  <h3>{program.name}</h3>
                  <span className={`ecocard__tag ${program.tone}`}>
                    {program.tag}
                  </span>
                </div>
                <p>{program.description}</p>
                <div className="ecocard__price">
                  <b>{program.price}</b>
                  <span>{program.priceNote}</span>
                </div>
                <Link href={program.href} className="btn btn--primary">
                  {program.cta} <span className="arw">→</span>
                </Link>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* PRINCIPIOS — cómo aprendes */}
      <section className="section-pad" id="metodo" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal className="shead">
            <span className="eyebrow">Cómo aprendes</span>
            <h2>
              Cuatro reglas del <b>método Builder.</b>
            </h2>
          </Reveal>
          <div className="principles">
            {principles.map((principle) => (
              <Reveal className="principle" key={principle.n}>
                <div className="principle__n">{principle.n}</div>
                <div className="principle__body">
                  <h3>{principle.title}</h3>
                  <p>{principle.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* LISTA PRIORITARIA */}
      <section className="section-pad" id="acceso-temprano" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="early">
            <Reveal className="early__intro">
              <span className="eyebrow">Mantente al día</span>
              <h2 className="early__title">
                Recibe aviso de cada <b>nuevo programa y Live.</b>
              </h2>
              <p className="early__lead">
                Déjame tu correo y te aviso cuando abra un nuevo programa, módulo o
                Live. Sin spam, solo lo importante del ecosistema Builder.
              </p>
              <div className="early__benefits">
                {earlyAccessBenefits.map((benefit) => (
                  <span key={benefit}>{benefit}</span>
                ))}
              </div>
            </Reveal>
            <div className="early__form">
              <EarlyAccessForm source="home" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA final + social */}
      <section className="section-pad cta" id="contacto">
        <Reveal className="wrap">
          <span className="eyebrow" style={{ justifyContent: "center", marginBottom: "1.4rem" }}>
            Empieza hoy
          </span>
          <h2>
            ¿Listo para construir tu <b>primer agente con IA?</b>
          </h2>
          <p>
            Llévate el programa del Live por USD 9.99 o empieza gratis con Claude
            desde Cero. Acceso inmediato dentro del LMS.
          </p>
          <div className="cta__row">
            <Link href="/registro?intent=buy" className="btn btn--primary">
              Obtener el programa · USD 9.99 <span className="arw">→</span>
            </Link>
            <Link href="/registro?intent=explore" className="btn btn--ghost">
              Empezar gratis
            </Link>
          </div>
          <p className="cta__fine">Pago único · sin suscripción · acceso inmediato</p>
          <div className="social">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener"
                aria-label={social.label}
              >
                <svg viewBox="0 0 24 24">
                  <path d={social.path} />
                </svg>
              </a>
            ))}
          </div>
        </Reveal>
      </section>
    </main>
  );
}
