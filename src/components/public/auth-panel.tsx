import Link from "next/link";

import { signIn } from "@/lib/auth";

type AuthPanelProps = {
  mode: "login" | "registro";
  intent?: "buy" | "explore";
  callbackUrl?: string;
};

function getRedirectTo(intent?: "buy" | "explore", callbackUrl?: string) {
  if (callbackUrl?.startsWith("/") && !callbackUrl.startsWith("//")) {
    return callbackUrl;
  }

  return intent ? `/app?intent=${intent}` : "/app";
}

const asideBullets = [
  "Empieza gratis con “Claude desde Cero”, sin tarjeta.",
  "Conecta OpenAI, Anthropic y Gemini en un producto real.",
  "Te llevas el agente funcionando, no solo teoría.",
];

export function AuthPanel({ mode, intent, callbackUrl }: AuthPanelProps) {
  const isBuyIntent = intent === "buy";
  const isRegistro = mode === "registro";
  const redirectTo = getRedirectTo(intent, callbackUrl);

  const eyebrow = isBuyIntent
    ? "Acceso fundador"
    : isRegistro
      ? "Empieza gratis"
      : "Bienvenido de vuelta";
  const title = isBuyIntent
    ? "Entra para activar tu acceso"
    : isRegistro
      ? "Crea tu cuenta y empieza a construir"
      : "Entra a tu entorno privado";
  const description = isBuyIntent
    ? "Primero conectas tu cuenta (con Google o con tu correo); después completas la compra dentro del LMS. Tu compra, acceso y progreso quedan en la misma cuenta."
    : isRegistro
      ? "Crea tu acceso al LMS oficial de Rodrigo HeredIA en segundos. Sin contraseña, sin tarjeta — entras y empiezas."
      : "Accede al LMS oficial de Rodrigo HeredIA y continúa justo donde quedaste.";

  const isEmailAuthConfigured = Boolean(
    process.env.EMAIL_SERVER && process.env.EMAIL_FROM,
  );

  return (
    <div className="relative left-1/2 -my-10 w-screen -translate-x-1/2 overflow-hidden bg-[#080b12] text-white sm:-my-14">
      <div className="grid min-h-[calc(100dvh-7.5rem)] lg:grid-cols-2">
        {/* ---- Panel visual: video + propuesta de valor ---- */}
        <aside className="relative flex min-h-[15rem] flex-col justify-end overflow-hidden border-b border-white/10 p-6 sm:min-h-[18rem] sm:p-8 lg:min-h-full lg:justify-between lg:border-b-0 lg:border-r lg:p-12">
          <video
            autoPlay
            muted
            loop
            playsInline
            aria-hidden
            poster="/videos/dataflow.jpg"
            className="absolute inset-0 h-full w-full object-cover opacity-40"
          >
            <source src="/videos/dataflow.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-[#080b12] via-[#080b12]/85 to-[#080b12]/40 lg:bg-gradient-to-r lg:from-[#080b12]/45 lg:via-[#080b12]/75 lg:to-[#080b12]" />

          {/* ticks blueprint */}
          <span
            aria-hidden
            className="pointer-events-none absolute left-4 top-4 h-4 w-4 border-l border-t border-sky-400/40"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute right-4 top-4 h-4 w-4 border-r border-t border-sky-400/40"
          />

          <div className="relative z-10 hidden lg:block">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-sky-300/90">
              Builder HeredIA · LMS oficial
            </p>
          </div>

          <div className="relative z-10">
            <h2 className="max-w-md text-2xl font-light leading-[1.15] tracking-tight text-white sm:text-3xl lg:text-[2.6rem]">
              Aprende a construir <b className="font-semibold">apps Multi-IA reales</b>, paso a paso.
            </h2>

            <ul className="mt-6 hidden space-y-2.5 sm:block">
              {asideBullets.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm leading-6 text-neutral-300">
                  <span aria-hidden className="mt-0.5 text-sky-400">
                    ▸
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-7 hidden items-center gap-3 lg:flex">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/bio/rodrigo.jpg"
                alt="Rodrigo HeredIA"
                className="h-11 w-11 rounded-full object-cover object-top ring-1 ring-white/20"
              />
              <div>
                <p className="text-sm font-semibold text-white">Rodrigo HeredIA</p>
                <p className="text-xs text-neutral-400">
                  CIO · Founder de Builder HeredIA
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* ---- Formulario ---- */}
        <section className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            <Link
              href="/"
              className="mb-7 inline-flex items-center gap-1.5 font-mono text-[0.7rem] font-medium uppercase tracking-[0.16em] text-neutral-400 transition hover:text-sky-300"
            >
              ← Volver al inicio
            </Link>

            <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-sky-300">
              {eyebrow}
            </p>
            <h1 className="mt-3 text-3xl font-light leading-tight tracking-tight text-white sm:text-4xl">
              {title}
            </h1>
            <p className="mt-4 text-sm leading-7 text-neutral-400">
              {description}
            </p>

            <div className="mt-8 space-y-4">
              <form
                action={async () => {
                  "use server";
                  await signIn("google", { redirectTo });
                }}
              >
                <button
                  type="submit"
                  className="group flex min-h-12 w-full items-center justify-center gap-3 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-neutral-950 shadow-lg shadow-sky-950/30 transition duration-300 hover:-translate-y-0.5 hover:bg-sky-100"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-950 text-xs font-bold text-white">
                    G
                  </span>
                  <span>Continuar con Google</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </button>
              </form>

              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-white/10" />
                <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-neutral-500">
                  {isEmailAuthConfigured ? "o con tu correo" : "método principal"}
                </span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              {isEmailAuthConfigured ? (
                <form
                  className="space-y-3 rounded-xl border border-white/10 bg-white/[0.03] p-4"
                  action={async (formData) => {
                    "use server";
                    await signIn("nodemailer", formData);
                  }}
                >
                  <input type="hidden" name="redirectTo" value={redirectTo} />
                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-neutral-300">
                      Acceso por correo
                    </span>
                    <input
                      required
                      type="email"
                      name="email"
                      autoComplete="email"
                      placeholder="tu@correo.com"
                      className="h-11 w-full rounded-lg border border-white/10 bg-[#080b12] px-3 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:border-sky-400"
                    />
                  </label>
                  <button
                    type="submit"
                    className="h-11 w-full rounded-lg border border-white/15 bg-white/[0.04] px-4 text-sm font-semibold text-neutral-100 transition hover:border-sky-400/60 hover:bg-sky-400/10"
                  >
                    Enviarme enlace de acceso
                  </button>
                </form>
              ) : (
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-neutral-400">
                  Muy pronto también podrás entrar por correo. Por ahora, Google
                  es la forma más rápida y segura de acceder.
                </div>
              )}
            </div>

            <p className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-neutral-500">
              <span>Sin tarjeta</span>
              <span aria-hidden className="text-neutral-700">
                ·
              </span>
              <span>Acceso inmediato</span>
              <span aria-hidden className="text-neutral-700">
                ·
              </span>
              <span>Pago único cuando quieras</span>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
