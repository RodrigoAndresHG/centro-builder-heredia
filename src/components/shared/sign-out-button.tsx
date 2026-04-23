import { signOut } from "@/lib/auth";

export function SignOutButton({ variant = "light" }: { variant?: "light" | "dark" }) {
  const className =
    variant === "dark"
      ? "rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm font-semibold text-white transition hover:border-neutral-500"
      : "rounded-md border border-border bg-surface px-3 py-2 text-sm font-semibold text-foreground";

  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <button
        type="submit"
        className={className}
      >
        Cerrar sesion
      </button>
    </form>
  );
}
