import type { Metadata } from "next";
import Link from "next/link";

import { Reveal } from "@/components/public/reveal";
import { bioConfig, type BioLink, type BrandKey } from "./bio-config";

export const metadata: Metadata = {
  title: `${bioConfig.profile.name} · Builder HeredIA`,
  description: bioConfig.profile.tagline,
};

const toneAccent: Record<BioLink["tone"], string> = {
  live: "from-teal-300/20 to-emerald-400/10 border-teal-300/40",
  flagship: "from-amber-400/15 to-orange-400/5 border-amber-400/30",
  free: "from-emerald-400/15 to-teal-400/5 border-emerald-400/30",
  channel: "from-emerald-500/15 to-emerald-400/5 border-emerald-400/30",
  social: "from-white/[0.06] to-white/[0.02] border-white/10",
};

// Logos oficiales (glifos de marca). fill por marca.
function BrandIcon({ brand }: { brand: BrandKey }) {
  if (brand === "whatsapp") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-[#25D366]">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
      </svg>
    );
  }

  if (brand === "instagram") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
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

  // tiktok
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-white">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

function ProfileHeader() {
  const { photoSrc, initials, name, title, tagline, verified } =
    bioConfig.profile;

  // Hero con foto: imagen grande estilo CIO con degradado y nombre encima.
  if (photoSrc) {
    return (
      <div>
        <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-black/50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photoSrc}
            alt={name}
            className="aspect-[4/5] w-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                {name}
              </h1>
              {verified ? (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-300 text-xs font-bold text-neutral-950">
                  ✓
                </span>
              ) : null}
            </div>
            <p className="mt-2 inline-flex rounded-full border border-teal-400/30 bg-teal-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-teal-200 backdrop-blur">
              {title}
            </p>
          </div>
        </div>
        <p className="mt-4 text-center text-sm leading-7 text-neutral-300">
          {tagline}
        </p>
      </div>
    );
  }

  // Fallback sin foto: avatar circular con iniciales.
  return (
    <div>
      <div className="relative mx-auto w-fit">
        <div className="rounded-full bg-gradient-to-tr from-teal-300 via-emerald-400 to-teal-500 p-[3px] shadow-2xl shadow-teal-500/30">
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-neutral-900 text-4xl font-semibold tracking-tight text-white sm:h-32 sm:w-32">
            {initials}
          </div>
        </div>
        {verified ? (
          <span className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-neutral-950 bg-teal-300 text-sm font-bold text-neutral-950">
            ✓
          </span>
        ) : null}
      </div>
      <div className="mt-5 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          {name}
        </h1>
        <p className="mt-2 inline-flex rounded-full border border-teal-400/30 bg-teal-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-teal-200">
          {title}
        </p>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-neutral-300">
          {tagline}
        </p>
      </div>
    </div>
  );
}

function LinkCard({ link }: { link: BioLink }) {
  const isExternal = link.href.startsWith("http");

  const content = (
    <div
      className={`flex items-center gap-4 rounded-2xl border bg-gradient-to-r ${toneAccent[link.tone]} p-4 backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-white/30`}
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-xl">
        {link.brand ? <BrandIcon brand={link.brand} /> : link.icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white">
          {link.title}
        </p>
        <p className="truncate text-xs text-neutral-400">{link.subtitle}</p>
      </div>
      <span className="shrink-0 text-neutral-500 transition group-hover:translate-x-0.5 group-hover:text-white">
        →
      </span>
    </div>
  );

  if (isExternal) {
    return (
      <a href={link.href} target="_blank" rel="noreferrer" className="group block">
        {content}
      </a>
    );
  }

  return (
    <Link href={link.href} className="group block">
      {content}
    </Link>
  );
}

export default function BioPage() {
  const { stats, featured, links, upcoming } = bioConfig;

  return (
    <main className="relative min-h-dvh overflow-hidden bg-neutral-950 text-white">
      {/* Glows de fondo */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-teal-400/20 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-emerald-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute left-0 top-1/3 h-64 w-64 rounded-full bg-teal-500/10 blur-[120px]" />

      <div className="relative mx-auto flex min-h-dvh max-w-md flex-col px-5 py-12 sm:py-16">
        <Reveal>
          <ProfileHeader />
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-6 grid grid-cols-3 gap-2">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-center backdrop-blur"
              >
                <p className="text-base font-semibold text-white">
                  {stat.value}
                </p>
                <p className="mt-1 text-[0.65rem] leading-tight text-neutral-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={200}>
          <Link
            href={featured.href}
            className="group mt-7 block overflow-hidden rounded-2xl border border-teal-300/40 bg-gradient-to-br from-teal-400/15 to-emerald-500/5 p-5 shadow-xl shadow-teal-950/30 backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-teal-300/60"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-red-300">
              <span className="flex h-1.5 w-1.5 rounded-full bg-red-500" />
              {featured.badge}
            </span>
            <h2 className="mt-3 text-lg font-semibold leading-tight text-white">
              {featured.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-neutral-300">
              {featured.description}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xl font-semibold text-white">
                {featured.price}
              </span>
              <span className="inline-flex items-center gap-2 rounded-md bg-teal-300 px-4 py-2 text-sm font-semibold text-neutral-950 transition group-hover:bg-teal-200">
                {featured.cta}
                <span className="transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </span>
            </div>
          </Link>
        </Reveal>

        <div className="mt-4 space-y-3">
          {links.map((link, index) => (
            <Reveal key={link.title} delay={260 + index * 70}>
              <LinkCard link={link} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={560}>
          <div className="mt-3 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-4 text-center">
            <p className="text-sm font-semibold text-neutral-300">
              <span aria-hidden="true" className="mr-1.5">
                🚧
              </span>
              {upcoming.label}
            </p>
            <p className="mt-1 text-xs text-neutral-500">{upcoming.note}</p>
          </div>
        </Reveal>

        <Reveal delay={620}>
          <footer className="mt-auto pt-10 text-center">
            <p className="text-xs text-neutral-600">
              © {bioConfig.profile.name} · builder.rodriheredia.com
            </p>
          </footer>
        </Reveal>
      </div>
    </main>
  );
}
