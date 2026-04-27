import Link from "next/link";

import { signIn } from "@/lib/auth";

type AuthPanelProps = {
  mode: "login" | "registro";
};

export function AuthPanel({ mode }: AuthPanelProps) {
  const badge = mode === "login" ? "Acceso" : "Registro";
  const title =
    mode === "login" ? "Entra a Builder HeredIA" : "Crea tu acceso a Builder";
  const description =
    mode === "login"
      ? "Accede al LMS oficial de Rodrigo HeredIA y continúa dentro de tu entorno privado."
      : "Entra al LMS oficial de Rodrigo HeredIA y prepárate para el lanzamiento del primer programa.";
  const isEmailAuthConfigured = Boolean(
    process.env.EMAIL_SERVER && process.env.EMAIL_FROM,
  );

  return (
    <div className="relative left-1/2 -my-10 w-screen -translate-x-1/2 overflow-hidden bg-neutral-950 text-white sm:-my-14">
      <div className="absolute inset-x-8 top-16 h-40 rounded-full bg-teal-300/10 blur-3xl" />
      <div className="mx-auto grid min-h-[calc(100dvh-8rem)] max-w-6xl gap-8 px-5 py-12 sm:px-6 lg:grid-cols-[0.9fr_1fr] lg:px-8 lg:py-16">
        <aside className="relative hidden flex-col justify-between rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl shadow-black/30 lg:flex">
          <div>
            <p className="text-xs font-semibold uppercase text-teal-300">
              Builder HeredIA
            </p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight text-white">
              El punto de entrada al LMS oficial de Rodrigo HeredIA.
            </h2>
            <p className="mt-4 text-sm leading-7 text-neutral-400">
              Programas, acceso privado, progreso y continuidad para construir
              productos Multi-IA con más criterio.
            </p>
          </div>

          <div className="grid gap-3">
            {["Build IdeaCash — Founder Access", "Acceso privado", "Lanzamiento 16 mayo 2026"].map(
              (item) => (
                <div
                  key={item}
                  className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 text-sm font-semibold text-neutral-200"
                >
                  {item}
                </div>
              ),
            )}
          </div>
        </aside>

        <section className="relative flex items-center">
          <div className="w-full rounded-2xl border border-neutral-800 bg-neutral-900/85 p-5 shadow-2xl shadow-black/40 backdrop-blur sm:p-7">
            <div className="mb-7">
              <Link
                href="/"
                className="mb-6 inline-flex rounded-full border border-neutral-800 bg-neutral-950 px-3 py-1 text-xs font-semibold uppercase text-neutral-400 transition hover:border-teal-400/40 hover:text-teal-200"
              >
                Volver al LMS
              </Link>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-300">
                {badge}
              </p>
              <h1 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-4xl">
                {title}
              </h1>
              <p className="mt-4 text-base leading-7 text-neutral-300">
                {description}
              </p>
            </div>

            <div className="space-y-4">
              <form
                action={async () => {
                  "use server";
                  await signIn("google", { redirectTo: "/app" });
                }}
              >
                <button
                  type="submit"
                  className="group flex min-h-12 w-full items-center justify-center gap-3 rounded-md bg-teal-300 px-4 py-3 text-sm font-semibold text-neutral-950 shadow-lg shadow-teal-950/40 transition duration-300 hover:-translate-y-0.5 hover:bg-teal-200"
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
                <div className="h-px flex-1 bg-neutral-800" />
                <span className="text-xs font-medium text-neutral-500">
                  método principal
                </span>
                <div className="h-px flex-1 bg-neutral-800" />
              </div>

              {isEmailAuthConfigured ? (
                <form
                  className="space-y-3 rounded-xl border border-neutral-800 bg-neutral-950 p-4"
                  action={async (formData) => {
                    "use server";
                    await signIn("nodemailer", formData);
                  }}
                >
                  <input type="hidden" name="redirectTo" value="/app" />
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
                      className="h-11 w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:border-teal-300"
                    />
                  </label>
                  <button
                    type="submit"
                    className="h-11 w-full rounded-md border border-neutral-700 bg-neutral-950 px-4 text-sm font-semibold text-neutral-100 transition hover:border-teal-400/50"
                  >
                    Enviarme enlace de acceso
                  </button>
                </form>
              ) : (
                <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 text-sm leading-6 text-neutral-400">
                  Muy pronto también podrás entrar por correo. Por ahora,
                  Google es la forma más rápida y segura de acceder.
                </div>
              )}
            </div>

            <div className="mt-7 rounded-xl border border-teal-400/20 bg-teal-400/10 p-4">
              <p className="text-sm font-semibold text-teal-100">
                Acceso privado, contenido y continuidad
              </p>
              <p className="mt-2 text-sm leading-6 text-teal-100/75">
                Tu cuenta te conecta con los programas activos y el entorno
                privado del LMS.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
