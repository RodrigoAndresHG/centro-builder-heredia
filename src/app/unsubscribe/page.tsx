import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { unsubscribeByToken } from "@/lib/services/email-sequence";

export const metadata: Metadata = {
  title: "Darte de baja | Builder HeredIA",
  robots: { index: false, follow: false },
  // Evita filtrar el token por el header Referer si el usuario navega fuera.
  referrer: "no-referrer",
};

type UnsubscribePageProps = {
  searchParams: Promise<{ token?: string; state?: string }>;
};

// Server Action: procesa la baja SOLO al confirmar (POST), no al abrir el link
// (evita que un escáner de correo dé de baja por prefetch).
async function unsubscribeAction(formData: FormData) {
  "use server";
  const token = String(formData.get("token") ?? "");
  const ok = await unsubscribeByToken(token);
  redirect(`/unsubscribe?state=${ok ? "ok" : "invalid"}`);
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-neutral-950 px-5 text-white">
      <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-7 text-center shadow-2xl shadow-black/40">
        {children}
      </div>
    </main>
  );
}

export default async function UnsubscribePage({
  searchParams,
}: UnsubscribePageProps) {
  const { token, state } = await searchParams;

  if (state === "ok") {
    return (
      <Shell>
        <h1 className="text-xl font-semibold text-white">Listo, te diste de baja</h1>
        <p className="mt-3 text-sm leading-6 text-neutral-400">
          No recibirás más correos de la secuencia de onboarding. Sigues teniendo
          tu cuenta y acceso al LMS con normalidad.
        </p>
        <Link
          href="/app"
          className="mt-6 inline-flex rounded-md bg-teal-300 px-5 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-teal-200"
        >
          Ir al LMS
        </Link>
      </Shell>
    );
  }

  if (state === "invalid") {
    return (
      <Shell>
        <h1 className="text-xl font-semibold text-white">Enlace no válido</h1>
        <p className="mt-3 text-sm leading-6 text-neutral-400">
          Este enlace de baja no es válido o ya expiró. Si sigues recibiendo
          correos, escríbeme a soporte@rodriheredia.com.
        </p>
      </Shell>
    );
  }

  if (!token) {
    return (
      <Shell>
        <h1 className="text-xl font-semibold text-white">Falta el enlace</h1>
        <p className="mt-3 text-sm leading-6 text-neutral-400">
          Abre este enlace desde el pie de uno de mis correos para darte de baja.
        </p>
      </Shell>
    );
  }

  return (
    <Shell>
      <h1 className="text-xl font-semibold text-white">
        ¿Darte de baja de los correos?
      </h1>
      <p className="mt-3 text-sm leading-6 text-neutral-400">
        Dejarás de recibir la secuencia de onboarding por email. Tu cuenta y tu
        acceso al LMS no se tocan.
      </p>
      <form action={unsubscribeAction} className="mt-6">
        <input type="hidden" name="token" value={token} />
        <button
          type="submit"
          className="inline-flex rounded-md border border-neutral-700 bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-red-400/60 hover:text-red-200"
        >
          Confirmar baja
        </button>
      </form>
    </Shell>
  );
}
