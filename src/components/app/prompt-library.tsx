"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { CopyButton } from "@/components/app/copy-button";

export type LibraryPrompt = {
  id: string;
  title: string;
  description: string | null;
  // Vacío cuando el prompt es premium y el usuario no tiene compra.
  body: string;
  platform: "CLAUDE" | "CHATGPT" | "GEMINI" | "MULTI";
  category: string;
  locked: boolean;
};

const platformMeta: Record<
  LibraryPrompt["platform"],
  { label: string; chip: string; badge: string }
> = {
  CLAUDE: {
    label: "Claude",
    chip: "border-orange-400/40 bg-orange-400/15 text-orange-200",
    badge: "border-orange-400/30 bg-orange-400/10 text-orange-200",
  },
  CHATGPT: {
    label: "ChatGPT",
    chip: "border-emerald-400/40 bg-emerald-400/15 text-emerald-200",
    badge: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  },
  GEMINI: {
    label: "Gemini",
    chip: "border-blue-400/40 bg-blue-400/15 text-blue-200",
    badge: "border-blue-400/30 bg-blue-400/10 text-blue-200",
  },
  MULTI: {
    label: "Multi-IA",
    chip: "border-teal-400/40 bg-teal-400/15 text-teal-200",
    badge: "border-teal-400/30 bg-teal-400/10 text-teal-200",
  },
};

const ALL_CATEGORIES = "__todas__";
const ALL_PLATFORMS = "__todas__";

function PromptCard({ prompt }: { prompt: LibraryPrompt }) {
  const [expanded, setExpanded] = useState(false);
  const meta = platformMeta[prompt.platform];

  return (
    <article className="flex h-full min-w-0 flex-col rounded-2xl border border-neutral-800 bg-neutral-900/70 p-4 transition duration-300 hover:border-neutral-700">
      <div className="flex items-center justify-between gap-3">
        <span
          className={`inline-flex shrink-0 rounded-full border px-2.5 py-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.1em] ${meta.badge}`}
        >
          {meta.label}
        </span>
        {prompt.locked ? (
          <span className="shrink-0 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-amber-200">
            🔒 Premium
          </span>
        ) : (
          <CopyButton value={prompt.body} />
        )}
      </div>

      <h3 className="mt-2.5 break-words text-sm font-semibold leading-snug text-white">
        {prompt.title}
      </h3>
      {prompt.description ? (
        <p className="mt-1 break-words text-xs leading-5 text-neutral-400">
          {prompt.description}
        </p>
      ) : null}

      {prompt.locked ? (
        <div className="mt-3 rounded-lg border border-amber-400/20 bg-amber-400/5 px-3 py-2">
          <p className="text-xs leading-5 text-amber-200/80">
            Se desbloquea con cualquier programa de pago.{" "}
            <Link
              href="/app/programas"
              className="font-semibold text-amber-200 underline underline-offset-2"
            >
              Ver programas
            </Link>
          </p>
        </div>
      ) : (
        <div className="mt-auto pt-3">
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
            className="text-xs font-semibold text-teal-300 transition hover:text-teal-200"
          >
            {expanded ? "Ocultar prompt ↑" : "Ver prompt ↓"}
          </button>
          {expanded ? (
            <pre className="mt-2 whitespace-pre-wrap break-words rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-3 font-mono text-xs leading-6 text-neutral-300 [overflow-wrap:anywhere]">
              {prompt.body}
            </pre>
          ) : null}
        </div>
      )}
    </article>
  );
}

export function PromptLibrary({ prompts }: { prompts: LibraryPrompt[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>(ALL_CATEGORIES);
  const [platform, setPlatform] = useState<string>(ALL_PLATFORMS);

  // Categorías con conteo, en el orden que llegan (ya ordenadas del server).
  const categories = useMemo(() => {
    const map = new Map<string, number>();
    for (const prompt of prompts) {
      map.set(prompt.category, (map.get(prompt.category) ?? 0) + 1);
    }
    return Array.from(map.entries());
  }, [prompts]);

  // Plataformas presentes con conteo. El filtro solo se muestra si hay
  // más de una (con una sola, es ruido).
  const platforms = useMemo(() => {
    const map = new Map<LibraryPrompt["platform"], number>();
    for (const prompt of prompts) {
      map.set(prompt.platform, (map.get(prompt.platform) ?? 0) + 1);
    }
    return Array.from(map.entries());
  }, [prompts]);
  const showPlatformRow = platforms.length > 1;

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return prompts.filter((prompt) => {
      if (category !== ALL_CATEGORIES && prompt.category !== category) {
        return false;
      }

      if (platform !== ALL_PLATFORMS && prompt.platform !== platform) {
        return false;
      }

      if (!normalized) {
        return true;
      }

      const haystack =
        `${prompt.title} ${prompt.description ?? ""} ${prompt.category} ${prompt.body}`.toLowerCase();

      return haystack.includes(normalized);
    });
  }, [prompts, query, category, platform]);

  const groups = useMemo(() => {
    const map = new Map<string, LibraryPrompt[]>();
    for (const prompt of filtered) {
      const list = map.get(prompt.category);
      if (list) {
        list.push(prompt);
      } else {
        map.set(prompt.category, [prompt]);
      }
    }
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <div className="space-y-6">
      {/* Barra de búsqueda y filtros pegajosa: queda a mano aunque bajes. */}
      <div className="sticky top-0 z-10 -mx-2 space-y-2.5 rounded-b-2xl bg-neutral-950/95 px-2 pb-3 pt-2 backdrop-blur">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Busca por tema, categoría o palabra clave..."
          className="h-11 w-full rounded-xl border border-neutral-800 bg-neutral-900 px-4 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:border-teal-300"
        />

        {/* Celular: selector desplegable (claro y compacto). */}
        <div className="sm:hidden">
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            aria-label="Filtrar por categoría"
            className="h-11 w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 text-sm font-semibold text-white outline-none transition focus:border-teal-300"
          >
            <option value={ALL_CATEGORIES}>
              Todas las categorías ({prompts.length})
            </option>
            {categories.map(([name, count]) => (
              <option key={name} value={name}>
                {name} ({count})
              </option>
            ))}
          </select>
        </div>

        {/* Desktop: chips envueltos en filas — todas las categorías visibles. */}
        <div className="hidden flex-wrap gap-2 sm:flex">
          <button
            type="button"
            onClick={() => setCategory(ALL_CATEGORIES)}
            aria-pressed={category === ALL_CATEGORIES}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
              category === ALL_CATEGORIES
                ? "border-teal-300/60 bg-teal-300/15 text-teal-100"
                : "border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-600"
            }`}
          >
            Todas
            <span className="ml-1.5 opacity-60">{prompts.length}</span>
          </button>
          {categories.map(([name, count]) => {
            const isActive = category === name;
            return (
              <button
                key={name}
                type="button"
                onClick={() => setCategory(isActive ? ALL_CATEGORIES : name)}
                aria-pressed={isActive}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                  isActive
                    ? "border-teal-300/60 bg-teal-300/15 text-teal-100"
                    : "border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-600"
                }`}
              >
                {name}
                <span className="ml-1.5 opacity-60">{count}</span>
              </button>
            );
          })}
        </div>

        {showPlatformRow ? (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setPlatform(ALL_PLATFORMS)}
              aria-pressed={platform === ALL_PLATFORMS}
              className={`rounded-full border px-3 py-1 text-[0.7rem] font-semibold transition ${
                platform === ALL_PLATFORMS
                  ? "border-white/40 bg-white/15 text-white"
                  : "border-neutral-800 bg-neutral-900 text-neutral-500 hover:border-neutral-600"
              }`}
            >
              Todas las IA
            </button>
            {platforms.map(([value, count]) => {
              const isActive = platform === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setPlatform(isActive ? ALL_PLATFORMS : value)}
                  aria-pressed={isActive}
                  className={`rounded-full border px-3 py-1 text-[0.7rem] font-semibold transition ${
                    isActive
                      ? platformMeta[value].chip
                      : "border-neutral-800 bg-neutral-900 text-neutral-500 hover:border-neutral-600"
                  }`}
                >
                  {platformMeta[value].label}
                  <span className="ml-1.5 opacity-60">{count}</span>
                </button>
              );
            })}
          </div>
        ) : null}

        <p className="text-[0.7rem] font-medium text-neutral-600">
          {filtered.length} de {prompts.length} prompts
        </p>
      </div>

      {groups.length === 0 ? (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-8 text-center">
          <p className="text-sm font-semibold text-white">
            No encontré prompts para tu búsqueda.
          </p>
          <p className="mt-1 text-sm text-neutral-400">
            Prueba con otra palabra o quita los filtros.
          </p>
        </div>
      ) : (
        groups.map(([categoryName, items]) => (
          <section key={categoryName} className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
              {categoryName}
              <span className="ml-2 text-neutral-600">{items.length}</span>
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              {items.map((prompt) => (
                <PromptCard key={prompt.id} prompt={prompt} />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
