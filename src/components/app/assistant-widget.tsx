"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const baseQuickQuestions = [
  "¿Cómo activo el acceso a un programa?",
  "Ya pagué y no veo mi acceso",
  "¿Cómo guardo mi progreso?",
  "¿Qué incluye la Biblioteca?",
];

const lessonQuickQuestions = [
  "Resúmeme esta lección",
  "Explícame esta lección con otras palabras",
  "¿Cómo guardo mi progreso?",
];

// Solo se envía la cola del historial para acotar tokens.
const HISTORY_LIMIT = 8;

// ¿Estamos dentro de una lección? → el asistente recibe su contexto y
// puede responder sobre el contenido (el servidor re-valida el acceso).
function parseLessonPath(pathname: string | null) {
  const match = pathname?.match(
    /^\/app\/programas\/([^/]+)\/lecciones\/([^/]+)\/?$/,
  );
  if (!match) {
    return null;
  }

  try {
    return {
      programSlug: decodeURIComponent(match[1]),
      lessonSlug: decodeURIComponent(match[2]),
    };
  } catch {
    return null;
  }
}

// Burbuja de chat con destello: marca del asistente en el botón y el header.
function AssistantIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 6.8l1 3.1 3.2 1-3.2 1-1 3.1-1-3.1-3.2-1 3.2-1z"
        fill="currentColor"
      />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// El modelo tiene instrucción de responder en texto plano, pero si se le
// escapa un **negrita** de Markdown lo renderizamos en vez de mostrar asteriscos.
function renderAssistantContent(content: string) {
  const parts = content.split("**");

  if (parts.length < 3) {
    return content;
  }

  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <strong key={index} className="font-semibold text-white">
        {part}
      </strong>
    ) : (
      part
    ),
  );
}

export function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const lessonContext = parseLessonPath(pathname);
  const quickQuestions = lessonContext
    ? lessonQuickQuestions
    : baseQuickQuestions;

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [open, messages, loading]);

  // En móvil el panel es una hoja casi a pantalla completa: congela el
  // scroll del fondo mientras está abierta.
  useEffect(() => {
    if (!open) return;
    if (!window.matchMedia("(max-width: 639px)").matches) return;

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

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
          ...(lessonContext ? { lessonContext } : {}),
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
      {/* Botón flotante: abajo-izquierda en escritorio (zona libre bajo el
          sidebar), abajo-derecha en móvil. En móvil se oculta al abrir la
          hoja porque esta trae su propio botón de cierre. */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={open ? "Cerrar asistente" : "Abrir asistente"}
        className={`fixed right-5 bottom-5 z-40 h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-teal-300 to-emerald-400 text-neutral-950 shadow-2xl shadow-teal-950/50 transition hover:-translate-y-0.5 hover:shadow-teal-900/60 sm:right-auto sm:left-5 ${
          open ? "hidden sm:flex" : "flex"
        }`}
      >
        {open ? (
          <CloseIcon className="h-6 w-6" />
        ) : (
          <AssistantIcon className="h-7 w-7" />
        )}
      </button>

      {/* Fondo oscurecido solo en móvil: enfoca la hoja y cierra al tocarlo */}
      {open ? (
        <button
          type="button"
          aria-label="Cerrar asistente"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 cursor-default bg-black/60 backdrop-blur-[2px] sm:hidden"
        />
      ) : null}

      {/* Panel de chat: hoja inferior a pantalla casi completa en móvil,
          tarjeta flotante abajo-izquierda en escritorio */}
      {open ? (
        <div className="fixed inset-x-0 bottom-0 z-50 flex h-[85dvh] flex-col overflow-hidden rounded-t-3xl border border-neutral-800 bg-neutral-950 shadow-2xl shadow-black/60 sm:inset-x-auto sm:bottom-24 sm:left-5 sm:h-[32rem] sm:max-h-[calc(100dvh-8rem)] sm:w-96 sm:rounded-3xl">
          {/* Grabber: señal de "hoja deslizable" solo en móvil */}
          <div className="flex shrink-0 justify-center pt-2.5 pb-1 sm:hidden">
            <span className="h-1 w-10 rounded-full bg-neutral-700" />
          </div>

          <div className="flex items-center gap-3 border-b border-neutral-800 bg-neutral-900/70 px-4 py-3.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-teal-400/30 bg-teal-400/10 text-teal-200">
              <AssistantIcon className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white">
                Asistente Builder
              </p>
              <p className="text-[0.7rem] text-neutral-500">
                Respuestas con IA · puede cometer errores
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar asistente"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 text-neutral-300 transition hover:border-neutral-600 hover:text-white"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
          >
            {messages.length === 0 ? (
              <div className="space-y-3">
                <p className="text-sm leading-6 text-neutral-300">
                  {lessonContext
                    ? "¡Hola! Estoy viendo esta lección contigo — pregúntame sobre su contenido, o sobre accesos y la plataforma."
                    : "¡Hola! Soy el asistente del LMS. Pregúntame sobre accesos, pagos, programas o cómo usar la plataforma."}
                </p>
                {lessonContext ? (
                  <p className="inline-flex rounded-full border border-teal-400/30 bg-teal-400/10 px-3 py-1 text-[0.65rem] font-semibold text-teal-200">
                    📖 Con contexto de esta lección
                  </p>
                ) : null}
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
                  {message.role === "assistant"
                    ? renderAssistantContent(message.content)
                    : message.content}
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
            className="flex items-center gap-2 border-t border-neutral-800 bg-neutral-900/70 px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
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
