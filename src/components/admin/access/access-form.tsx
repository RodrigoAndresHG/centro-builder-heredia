import type { ReactNode } from "react";

type FormAction = (formData: FormData) => void | Promise<void>;

type UserOption = {
  email: string | null;
  name: string | null;
  roleKey: string;
};

type ProductOption = {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
};

type ProgramOption = {
  id: string;
  title: string;
  slug: string;
  isPublished: boolean;
  status: string;
  product: {
    name: string;
  } | null;
};

type AccessFormValue = {
  user?: {
    email: string | null;
  } | null;
  productId?: string | null;
  programId?: string | null;
  status?: string | null;
  startsAt?: Date | null;
  expiresAt?: Date | null;
};

function FieldLabel({ children }: { children: ReactNode }) {
  return <span className="text-sm font-semibold text-neutral-700">{children}</span>;
}

function dateValue(date?: Date | null) {
  if (!date) {
    return "";
  }

  return date.toISOString().slice(0, 10);
}

export function AccessStatusBadge({ status }: { status: string }) {
  const isActive = status === "ACTIVE";

  return (
    <span
      className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ${
        isActive
          ? "bg-emerald-50 text-emerald-700"
          : "bg-neutral-100 text-neutral-600"
      }`}
    >
      {isActive ? "Activo" : "Inactivo"}
    </span>
  );
}

export function AccessForm({
  action,
  access,
  users,
  products,
  programs,
  submitLabel,
}: {
  action: FormAction;
  access?: AccessFormValue | null;
  users: UserOption[];
  products: ProductOption[];
  programs: ProgramOption[];
  submitLabel: string;
}) {
  return (
    <form action={action} className="space-y-5">
      <label className="block space-y-2">
        <FieldLabel>Email del usuario</FieldLabel>
        <input
          name="email"
          required
          list="admin-access-users"
          defaultValue={access?.user?.email ?? ""}
          placeholder="usuario@example.com"
          className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none transition focus:border-accent"
        />
        <datalist id="admin-access-users">
          {users.map((user) =>
            user.email ? (
              <option key={user.email} value={user.email}>
                {user.name
                  ? `${user.name} · ${user.roleKey}`
                  : user.roleKey}
              </option>
            ) : null,
          )}
        </datalist>
      </label>

      <div className="grid gap-4 lg:grid-cols-2">
        <label className="block space-y-2">
          <FieldLabel>Producto</FieldLabel>
          <select
            name="productId"
            defaultValue={access?.productId ?? ""}
            className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none transition focus:border-accent"
          >
            <option value="">Sin producto directo</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} {product.isActive ? "" : "(inactivo)"}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-2">
          <FieldLabel>Programa</FieldLabel>
          <select
            name="programId"
            defaultValue={access?.programId ?? ""}
            className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none transition focus:border-accent"
          >
            <option value="">Sin programa directo</option>
            {programs.map((program) => (
              <option key={program.id} value={program.id}>
                {program.title} ({program.status})
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="text-sm leading-6 text-neutral-600">
        Selecciona producto o programa. Para productos premium, usa producto; el
        acceso cubrira los programas asociados.
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="block space-y-2">
          <FieldLabel>Estado</FieldLabel>
          <select
            name="status"
            defaultValue={access?.status ?? "ACTIVE"}
            className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none transition focus:border-accent"
          >
            <option value="ACTIVE">Activo</option>
            <option value="INACTIVE">Inactivo</option>
          </select>
        </label>

        <label className="block space-y-2">
          <FieldLabel>Inicio</FieldLabel>
          <input
            type="date"
            name="startsAt"
            defaultValue={dateValue(access?.startsAt) || dateValue(new Date())}
            className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none transition focus:border-accent"
          />
        </label>

        <label className="block space-y-2">
          <FieldLabel>Expira</FieldLabel>
          <input
            type="date"
            name="expiresAt"
            defaultValue={dateValue(access?.expiresAt)}
            className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none transition focus:border-accent"
          />
        </label>
      </div>

      <button
        type="submit"
        className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
      >
        {submitLabel}
      </button>
    </form>
  );
}
