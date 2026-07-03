"use client";

import { useState } from "react";

// Borrado de usuario con freno anti-error: hay que escribir el correo exacto
// (o el ID si no tiene correo) antes de que el botón se habilite. Avisa si el
// usuario tiene compras o accesos activos.
export function DeleteUserControl({
  action,
  expected,
  purchaseCount,
  accessCount,
}: {
  action: (formData: FormData) => Promise<void>;
  expected: string;
  purchaseCount: number;
  accessCount: number;
}) {
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const matches = typed.trim().toLowerCase() === expected.toLowerCase();

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs font-semibold text-red-600 transition hover:text-red-700"
      >
        Eliminar
      </button>
    );
  }

  return (
    <form action={action} className="w-56 space-y-2">
      <p className="text-xs leading-5 text-neutral-500">
        Escribe{" "}
        <code className="rounded bg-neutral-100 px-1 py-0.5 text-[0.65rem] text-neutral-700">
          {expected}
        </code>{" "}
        para confirmar.
      </p>
      {purchaseCount > 0 || accessCount > 0 ? (
        <p className="text-xs font-medium text-amber-600">
          ⚠ {purchaseCount} compra{purchaseCount === 1 ? "" : "s"} y{" "}
          {accessCount} acceso{accessCount === 1 ? "" : "s"} se borrarán.
        </p>
      ) : null}
      <input
        name="confirmValue"
        value={typed}
        onChange={(event) => setTyped(event.target.value)}
        autoComplete="off"
        placeholder={expected}
        className="h-8 w-full rounded border border-red-300 bg-white px-2 text-xs text-neutral-900 outline-none transition focus:border-red-500"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={!matches}
          className="rounded bg-red-600 px-2.5 py-1 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Eliminar
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setTyped("");
          }}
          className="rounded border border-neutral-300 px-2.5 py-1 text-xs font-medium text-neutral-600 transition hover:bg-neutral-100"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
