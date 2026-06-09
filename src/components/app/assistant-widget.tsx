"use client";

import { useEffect, useRef, useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const quickQuestions = [
  "¿Cómo activo el acceso a un programa?",
  "Ya pagué y no veo mi acceso",
  "¿Cómo guardo mi progreso?",
  "¿Qué incluye la Biblioteca?",
];

// Solo se envía la cola del historial para acotar tokens.
const HISTORY_LIMIT = 8;

export function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [open, messages, loading]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: trimmed.slice(0, 1500) },
    ];

    setMessages(nextMessages);
    setInput("");
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/asistente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.slice(-HISTORY_LIMIT),
        }),
      });

      const payload = (await response.json().catch(() => null)) as {
        reply?: string;
        error?: string;
      } | null;

      if (!response.ok || !payload?.reply) {
        setError(payload?.error ?? "El asistente tuvo un problema. Intenta de nuevo.");
        return;
      }

      setMessages((current) => [
        ...current,
        { role: "assistant", content: payload.reply as string },
      ]);
    } catch {
      setError("No pude conectar con el asistente. Revisa tu conexión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Botón flotante */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={open ? "Cerrar asistente" : "Abrir asistente"}
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-teal-300 to-emerald-400 text-2xl shadow-2xl shadow-teal-950/50 transition hover:-translate-y-0.5 hover:shadow-teal-900/60"
      >
        {open ? (
          <span aria-hidden className="text-xl font-bold text-neutral-950">
            ✕
          </span>
        ) : (
          <span aria-hidden>✨</span>
        )}
      </button>

      {/* Panel de chat */}
      {open ? (
        <div className="fixed inset-x-3 bottom-22 z-40 flex max-h-[72dvh] flex-col overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-950 shadow-2xl shadow-black/60 sm:inset-x-auto sm:right-5 sm:bottom-22 sm:w-96">
          <div className="flex items-center justify-between gap-3 border-b border-neutral-800 bg-neutral-900/70 px-5 py-4">
            <div>
              <p className="text-sm font-semibold text-white">
                Asistente Builder
              </p>
              <p className="text-[0.7rem] text-neutral-500">
                Respuestas con IA · puede cometer errores
              </p>
            </div>
            <span className="rounded-full border border-teal-400/30 bg-teal-400/10 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-teal-200">
              IA
            </span>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
          >
            {messages.length === 0 ? (
              <div className="space-y-3">
                <p className="text-sm leading-6 text-neutral-300">
                  ¡Hola! Soy el asistente del LMS. Pregúntame sobre accesos,
                  pagos, programas o cómo usar la plataforma.
                </p>
                <div className="space-y-2">
                  {quickQuestions.map((question) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() => void send(question)}
                      className="block w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2.5 text-left text-xs font-medium text-neutral-200 transition hover:border-teal-400/40"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={`${index}-${message.role}`}
                  className={
                    message.role === "user"
                      ? "ml-8 rounded-2xl rounded-br-md bg-teal-300 px-3.5 py-2.5 text-sm leading-6 text-neutral-950"
                      : "mr-8 whitespace-pre-wrap break-words rounded-2xl rounded-bl-md border border-neutral-800 bg-neutral-900 px-3.5 py-2.5 text-sm leading-6 text-neutral-200"
                  }
                >
                  {message.content}
                </div>
              ))
            )}

            {loading ? (
              <div className="mr-8 flex w-fit items-center gap-1.5 rounded-2xl rounded-bl-md border border-neutral-800 bg-neutral-900 px-4 py-3">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-teal-300 [animation-delay:0ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-teal-300 [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-teal-300 [animation-delay:300ms]" />
              </div>
            ) : null}

            {error ? (
              <p className="rounded-xl border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs leading-5 text-amber-200">
                {error}
              </p>
            ) : null}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              void send(input);
            }}
            className="flex items-center gap-2 border-t border-neutral-800 bg-neutral-900/70 px-3 py-3"
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              maxLength={1500}
              placeholder="Escribe tu pregunta..."
              className="h-11 min-w-0 flex-1 rounded-xl border border-neutral-800 bg-neutral-950 px-3 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:border-teal-300"
            />
            <button
              type="submit"
              disabled={loading || input.trim().length === 0}
              className="h-11 shrink-0 rounded-xl bg-teal-300 px-4 text-sm font-semibold text-neutral-950 transition hover:bg-teal-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Enviar
            </button>
          </form>
        </div>
      ) : null}
    </>
  );
}
