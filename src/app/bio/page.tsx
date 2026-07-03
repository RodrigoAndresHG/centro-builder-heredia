import type { Metadata } from "next";
import Link from "next/link";

import { buildRegistroHref, normalizeSrc } from "@/lib/attribution";
import {
  MUNDIAL_ACTIVO,
  bioConfig,
  type BioCourse,
  type BioSocial,
  type BrandKey,
} from "./bio-config";
import { OpenInBrowserBanner } from "./open-in-browser-banner";

export const metadata: Metadata = {
  title: `${bioConfig.profile.name} · Builder HeredIA`,
  description: bioConfig.profile.tagline,
};

// Logos oficiales (glifos de marca).
function BrandIcon({ brand }: { brand: BrandKey }) {
  if (brand === "whatsapp") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-[#25D366]">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
      </svg>
    );
  }

  if (brand === "instagram") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
        <defs>
          <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFD600" />
            <stop offset="45%" stopColor="#FF0100" />
            <stop offset="100%" stopColor="#D800B9" />
          </linearGradient>
        </defs>
        <path
          fill="url(#ig-grad)"
          d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.015 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.015 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.015 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.058-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-white">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

function CompactAvatar() {
  const { photoSrc, initials, name, verified } = bioConfig.profile;

  return (
    <div className="relative mx-auto w-fit">
      <div className="rounded-full bg-gradient-to-tr from-teal-300 via-emerald-400 to-teal-500 p-[3px] shadow-2xl shadow-teal-500/30">
        {photoSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoSrc}
            alt={name}
            className="h-24 w-24 rounded-full object-cover object-top"
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-neutral-900 text-3xl font-semibold text-white">
            {initials}
          </div>
        )}
      </div>
      {verified ? (
        <span className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-neutral-950 bg-teal-300 text-xs font-bold text-neutral-950">
          ✓
        </span>
      ) : null}
    </div>
  );
}

function CourseCard({ course, href }: { course: BioCourse; href: string }) {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-3 rounded-2xl border p-4 backdrop-blur transition duration-300 hover:-translate-y-0.5 ${
        course.highlight
          ? "border-teal-300/50 bg-gradient-to-r from-teal-400/15 to-emerald-500/5 hover:border-teal-300/70"
          : "border-white/10 bg-white/[0.04] hover:border-white/25"
      }`}
    >
      <div className="min-w-0 flex-1">
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.1em] ${
            course.highlight
              ? "bg-teal-300 text-neutral-950"
              : course.price === "Gratis"
                ? "bg-emerald-400/20 text-emerald-200"
                : "bg-white/10 text-neutral-300"
          }`}
        >
          {course.tag}
        </span>
        <p className="mt-1.5 truncate text-sm font-semibold text-white">
          {course.name}
        </p>
        <p className="truncate text-xs text-neutral-400">{course.note}</p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-sm font-bold text-white">{course.price}</p>
        <span className="text-xs font-semibold text-teal-300 transition group-hover:translate-x-0.5">
          {course.cta}
        </span>
      </div>
    </Link>
  );
}

function MundialCard({ href }: { href: string }) {
  const { mundial } = bioConfig;
  return (
    <a
      href={href}
      className="group flex items-center gap-4 rounded-2xl border border-amber-400/40 bg-gradient-to-r from-amber-500/20 to-orange-500/5 p-4 backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-amber-300/70"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-400/15 text-2xl">
        ⚽
      </span>
      <div className="min-w-0 flex-1">
        <span className="inline-flex rounded-full bg-amber-400/20 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-amber-200">
          {mundial.tag}
        </span>
        <p className="mt-1 truncate text-sm font-semibold text-white">
          {mundial.title}
        </p>
        <p className="truncate text-xs text-amber-100/80">{mundial.note}</p>
      </div>
      <span className="shrink-0 rounded-md bg-amber-400 px-3 py-2 text-xs font-semibold text-neutral-950 transition group-hover:bg-amber-300">
        {mundial.cta}
      </span>
    </a>
  );
}

function ChannelCard({ href }: { href: string }) {
  const { channel } = bioConfig;
  return (
    <a
      href={href}
      className="group flex items-center gap-4 rounded-2xl border border-emerald-400/40 bg-gradient-to-r from-emerald-500/20 to-emerald-400/5 p-4 backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-emerald-400/70"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-400/15">
        <BrandIcon brand="whatsapp" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-white">{channel.title}</p>
        <p className="mt-0.5 text-xs leading-5 text-emerald-100/80">
          {channel.note}
        </p>
      </div>
      <span className="shrink-0 rounded-md bg-emerald-400 px-3 py-2 text-xs font-semibold text-neutral-950 transition group-hover:bg-emerald-300">
        Unirme
      </span>
    </a>
  );
}

function SocialButton({ social }: { social: BioSocial }) {
  const href = social.href;
  return (
    <a
      href={href}
      className="group flex flex-1 flex-col items-center gap-1.5 rounded-2xl border border-white/10 bg-white/[0.04] py-3 transition duration-300 hover:-translate-y-0.5 hover:border-white/25"
    >
      <BrandIcon brand={social.brand} />
      <span className="text-[0.7rem] font-semibold text-neutral-300">
        {social.label}
      </span>
    </a>
  );
}

type BioPageProps = {
  searchParams: Promise<{ src?: string }>;
};

export default async function BioPage({ searchParams }: BioPageProps) {
  const { profile, courses, socials, upcoming, mundial } = bioConfig;
  const { src: rawSrc } = await searchParams;
  const src = normalizeSrc(rawSrc);

  // El canal de WhatsApp no acepta UTMs → redirect interno /go/whatsapp que
  // registra el clic por fuente y luego 302 al canal.
  const whatsappHref = `/go/whatsapp?src=${encodeURIComponent(src)}`;
  // PronostiGol es externo; le pasamos UTMs por si su lado los lee.
  const mundialHref = `${mundial.href}?utm_source=${encodeURIComponent(
    src,
  )}&utm_medium=bio`;

  return (
    <main className="relative min-h-dvh overflow-hidden bg-neutral-950 text-white">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-teal-400/20 blur-[110px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-emerald-500/10 blur-[110px]" />

      <div className="relative mx-auto flex min-h-dvh max-w-md flex-col px-5 py-8">
        <OpenInBrowserBanner />

        {/* Header compacto */}
        <CompactAvatar />
        <div className="mt-4 text-center">
          <h1 className="text-xl font-semibold tracking-tight text-white">
            {profile.name}
          </h1>
          <p className="mt-1.5 inline-flex rounded-full border border-teal-400/30 bg-teal-400/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-teal-200">
            {profile.title}
          </p>
          <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-neutral-300">
            {profile.tagline}
          </p>
        </div>

        {/* Cursos */}
        <p className="mt-7 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
          Cursos
        </p>
        <div className="mt-3 space-y-3">
          {courses.map((course) => (
            <CourseCard
              key={course.name}
              course={course}
              href={buildRegistroHref(course.intent, src)}
            />
          ))}
        </div>

        {/* Tarjeta Mundial (PronostiGol) — solo en temporada */}
        {MUNDIAL_ACTIVO ? (
          <div className="mt-5">
            <MundialCard href={mundialHref} />
          </div>
        ) : null}

        {/* Canal de WhatsApp destacado */}
        <div className="mt-5">
          <ChannelCard href={whatsappHref} />
        </div>

        {/* Sígueme */}
        <p className="mt-7 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
          Sígueme
        </p>
        <div className="mt-3 flex gap-3">
          {socials.map((social) => (
            <SocialButton key={social.brand} social={social} />
          ))}
        </div>

        {/* Próximos */}
        <div className="mt-5 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-3 text-center">
          <p className="text-xs font-semibold text-neutral-300">
            <span aria-hidden="true" className="mr-1">
              🚧
            </span>
            {upcoming.label}
          </p>
          <p className="mt-0.5 text-[0.7rem] text-neutral-500">{upcoming.note}</p>
        </div>

        <footer className="mt-auto pt-8 text-center">
          <p className="text-[0.7rem] text-neutral-600">
            © {profile.name} · builder.rodriheredia.com
          </p>
        </footer>
      </div>
    </main>
  );
}
