import { updateMyName } from "@/lib/actions/profile";

/**
 * Lightweight, non-blocking prompt shown on the dashboard when the
 * user's name is missing (typical for email magic-link signups, which
 * only capture the email). Lets them set a name so the community and
 * the LMS can address them properly.
 */
export function ProfileNamePrompt() {
  return (
    <div className="rounded-2xl border border-teal-400/25 bg-teal-400/10 p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-300">
        Completa tu perfil
      </p>
      <h2 className="mt-3 text-xl font-semibold text-white">
        ¿Cómo te llamas?
      </h2>
      <p className="mt-2 text-sm leading-7 text-neutral-300">
        Personaliza tu experiencia y preséntate en la comunidad con tu nombre.
      </p>
      <form
        action={updateMyName}
        className="mt-4 flex flex-col gap-3 sm:flex-row"
      >
        <input
          name="name"
          required
          minLength={2}
          maxLength={80}
          autoComplete="name"
          placeholder="Tu nombre"
          className="h-11 flex-1 rounded-md border border-neutral-700 bg-neutral-950 px-3 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:border-teal-300"
        />
        <button
          type="submit"
          className="h-11 rounded-md bg-teal-300 px-4 text-sm font-semibold text-neutral-950 transition hover:bg-teal-200"
        >
          Guardar
        </button>
      </form>
    </div>
  );
}
