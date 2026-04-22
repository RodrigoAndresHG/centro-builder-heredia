import { signOut } from "@/lib/auth";

export function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <button
        type="submit"
        className="rounded-md border border-border bg-surface px-3 py-2 text-sm font-semibold text-foreground"
      >
        Cerrar sesion
      </button>
    </form>
  );
}
