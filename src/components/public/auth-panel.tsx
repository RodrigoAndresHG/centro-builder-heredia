import { signIn } from "@/lib/auth";

type AuthPanelProps = {
  mode: "login" | "registro";
};

export function AuthPanel({ mode }: AuthPanelProps) {
  const title = mode === "login" ? "Entrar a tu cuenta" : "Crear acceso";
  const description =
    mode === "login"
      ? "Usa Google o recibe un enlace seguro por correo."
      : "El registro inicial crea una cuenta con rol INVITADO.";
  const isEmailAuthConfigured = Boolean(
    process.env.EMAIL_SERVER && process.env.EMAIL_FROM,
  );

  return (
    <div className="mx-auto max-w-md rounded-lg border border-border bg-surface p-6 shadow-sm shadow-neutral-950/5">
      <div className="mb-6 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
          Acceso
        </p>
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        <p className="text-sm leading-6 text-neutral-600">{description}</p>
      </div>

      <div className="space-y-3">
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/app" });
          }}
        >
          <button
            type="submit"
            className="flex h-11 w-full items-center justify-center rounded-md bg-accent px-4 text-sm font-semibold text-accent-foreground"
          >
            Continuar con Google
          </button>
        </form>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs font-medium text-neutral-500">o</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {isEmailAuthConfigured ? (
          <form
            className="space-y-3"
            action={async (formData) => {
              "use server";
              await signIn("nodemailer", formData);
            }}
          >
            <input type="hidden" name="redirectTo" value="/app" />
            <label className="block space-y-2">
              <span className="text-sm font-medium text-neutral-700">Correo</span>
              <input
                required
                type="email"
                name="email"
                autoComplete="email"
                placeholder="tu@correo.com"
                className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none transition focus:border-accent"
              />
            </label>
            <button
              type="submit"
              className="h-11 w-full rounded-md border border-border bg-surface px-4 text-sm font-semibold text-foreground"
            >
              Enviarme enlace de acceso
            </button>
          </form>
        ) : (
          <div className="rounded-md border border-border bg-background p-3 text-sm leading-6 text-neutral-600">
            Configura EMAIL_SERVER y EMAIL_FROM para habilitar acceso por correo.
          </div>
        )}
      </div>
    </div>
  );
}
