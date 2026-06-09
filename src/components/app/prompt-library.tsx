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

const platformFilters = ["TODOS", "CLAUDE", "CHATGPT", "GEMINI", "MULTI"] as const;
type PlatformFilter = (typeof platformFilters)[number];

function PromptCard({ prompt }: { prompt: LibraryPrompt }) {
  const [expanded, setExpanded] = useState(false);
  const meta = platformMeta[prompt.platform];

  return (
    <article className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5 transition duration-300 hover:border-neutral-700">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <span
            className={`inline-flex rounded-full border px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.1em] ${meta.badge}`}
          >
            {meta.label}
          </span>
          <h3 className="mt-2 break-words text-base font-semibold text-white">
            {prompt.title}
          </h3>
          {prompt.description ? (
            <p className="mt-1 break-words text-sm leading-6 text-neutral-400">
              {prompt.description}
            </p>
          ) : null}
        </div>
        {!prompt.locked ? (
          <div className="shrink-0">
            <CopyButton value={prompt.body} />
          </div>
        ) : null}
      </div>

      {prompt.locked ? (
        <div className="mt-4 rounded-xl border border-amber-400/25 bg-amber-400/10 p-4">
          <p className="text-sm font-semibold text-amber-100">
            🔒 Prompt premium
          </p>
          <p className="mt-1 text-xs leading-5 text-amber-200/80">
            Se desbloquea con la compra de cualquier programa de Builder.
          </p>
          <Link
            href="/app/programas"
            className="mt-3 inline-flex rounded-md bg-amber-300 px-3 py-1.5 text-xs font-semibold text-neutral-950 transition hover:bg-amber-200"
          >
            Ver programas →
          </Link>
        </div>
      ) : (
        <div className="mt-4">
          <pre
            className={`whitespace-pre-wrap break-words rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 font-mono text-xs leading-6 text-neutral-300 [overflow-wrap:anywhere] ${
              expanded ? "" : "max-h-28 overflow-hidden"
            }`}
          >
            {prompt.body}
          </pre>
          {prompt.body.length > 220 ? (
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              className="mt-2 text-xs font-semibold text-teal-300 transition hover:text-teal-200"
            >
              {expanded ? "Ocultar ↑" : "Ver prompt completo ↓"}
            </button>
          ) : null}
        </div>
      )}
    </article>
  );
}

export function PromptLibrary({ prompts }: { prompts: LibraryPrompt[] }) {
  const [query, setQuery] = useState("");
  const [platform, setPlatform] = useState<PlatformFilter>("TODOS");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return prompts.filter((prompt) => {
      if (platform !== "TODOS" && prompt.platform !== platform) {
        return false;
      }

      if (!normalized) {
        return true;
      }

      const haystack =
        `${prompt.title} ${prompt.description ?? ""} ${prompt.category} ${prompt.body}`.toLowerCase();

      return haystack.includes(normalized);
    });
  }, [prompts, query, platform]);

  // Agrupar por categoría preservando el orden de llegada (ya viene ordenado).
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

  const counts = useMemo(() => {
    const base: Record<PlatformFilter, number> = {
      TODOS: prompts.length,
      CLAUDE: 0,
      CHATGPT: 0,
      GEMINI: 0,
      MULTI: 0,
    };
    for (const prompt of prompts) {
      base[prompt.platform] += 1;
    }
    return base;
  }, [prompts]);

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Busca por tema, categoría o palabra clave..."
          className="h-12 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:border-teal-300"
        />

        <div className="flex gap-2 overflow-x-auto pb-1">
          {platformFilters.map((value) => {
            const isActive = platform === value;
            const label = value === "TODOS" ? "Todos" : platformMeta[value].label;
            const count = counts[value];

            return (
              <button
                key={value}
                type="button"
                onClick={() => setPlatform(value)}
                aria-pressed={isActive}
                className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                  isActive
                    ? value === "TODOS"
                      ? "border-white/40 bg-white/15 text-white"
                      : platformMeta[value].chip
                    : "border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-600"
                }`}
              >
                {label}
                <span className="ml-1.5 opacity-60">{count}</span>
              </button>
            );
          })}
        </div>
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
        groups.map(([category, items]) => (
          <section key={category} className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
              {category}
              <span className="ml-2 text-neutral-600">{items.length}</span>
            </h2>
            <div className="space-y-3">
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
