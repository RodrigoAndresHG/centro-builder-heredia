"use client";

import { useActionState, type ReactNode } from "react";
import { useFormStatus } from "react-dom";

import type { AccessActionState } from "@/lib/actions/admin-access";

type FormAction = (
  previousState: AccessActionState | void,
  formData: FormData,
) => Promise<AccessActionState | void>;

type UserOption = {
  id: string;
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
    id: string;
    email: string | null;
    name: string | null;
    roleKey: string;
  } | null;
  productId?: string | null;
  programId?: string | null;
  status?: string | null;
  source?: string | null;
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

function programStatusLabel(status: string) {
  const labels: Record<string, string> = {
    DRAFT: "Borrador",
    PRESALE: "Preventa",
    OPEN: "Abierto",
  };

  return labels[status] ?? status;
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

export function AccessSourceBadge({ source }: { source?: string | null }) {
  const labels: Record<string, string> = {
    STRIPE: "Pago confirmado",
    MANUAL: "Acceso manual",
    TEST: "Acceso de prueba",
  };
  const styles: Record<string, string> = {
    STRIPE: "bg-sky-50 text-sky-700",
    MANUAL: "bg-amber-50 text-amber-700",
    TEST: "bg-violet-50 text-violet-700",
  };
  const key = source ?? "MANUAL";

  return (
    <span
      className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ${
        styles[key] ?? styles.MANUAL
      }`}
    >
      {labels[key] ?? labels.MANUAL}
    </span>
  );
}

function SubmitButton({ children }: { children: ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
    >
      {pending ? "Guardando..." : children}
    </button>
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
  const [state, formAction] = useActionState(action, {});
  const isStripeAccess = access?.source === "STRIPE";

  return (
    <form action={formAction} className="space-y-5">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm font-semibold text-amber-900">
          Este flujo crea accesos manuales fuera de Stripe.
        </p>
        <p className="mt-1 text-sm leading-6 text-amber-800">
          Úsalo solo para pruebas, demos o habilitación excepcional de usuarios.
          La compra oficial sigue pasando por Stripe.
        </p>
      </div>

      {state?.type === "error" && state.message ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {state.message}
        </div>
      ) : null}

      <label className="block space-y-2">
        <FieldLabel>Usuario existente del LMS</FieldLabel>
        <select
          name="userId"
          required
          defaultValue={access?.user?.id ?? ""}
          className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none transition focus:border-accent"
        >
          <option value="">Selecciona una cuenta existente</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name ? `${user.name} · ` : ""}
              {user.email ?? "Sin email"} · {user.roleKey}
            </option>
          ))}
        </select>
        <p className="text-sm leading-6 text-neutral-600">
          Primero el usuario debe existir en Builder. Este formulario no crea
          cuentas nuevas.
        </p>
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
                {program.title} · {programStatusLabel(program.status)}
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
          <FieldLabel>Origen</FieldLabel>
          {isStripeAccess ? (
            <>
              <input type="hidden" name="source" value="STRIPE" />
              <div className="flex h-11 items-center rounded-md border border-border bg-surface-muted px-3 text-sm font-semibold text-neutral-700">
                Pago confirmado por Stripe
              </div>
            </>
          ) : (
            <select
              name="source"
              defaultValue={access?.source ?? "MANUAL"}
              className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none transition focus:border-accent"
            >
              <option value="MANUAL">Acceso manual</option>
              <option value="TEST">Acceso de prueba</option>
            </select>
          )}
        </label>

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

      <SubmitButton>{submitLabel}</SubmitButton>
    </form>
  );
}
