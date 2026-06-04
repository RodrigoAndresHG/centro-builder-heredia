import type { Metadata } from "next";
import Link from "next/link";

import { Reveal } from "@/components/public/reveal";
import { bioConfig, type BioLink } from "./bio-config";

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
        {link.icon}
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
  const { stats, featured, links } = bioConfig;

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

        <Reveal delay={600}>
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
