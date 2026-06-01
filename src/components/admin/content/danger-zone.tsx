"use client";

import { useState } from "react";

/**
 * Danger zone for programs: requires the admin to type the program
 * slug exactly before the delete button enables. The actual deletion
 * is a server action passed in via `action`.
 */
export function DeleteProgramDangerZone({
  action,
  programSlug,
  moduleCount,
  lessonCount,
  accessCount,
}: {
  action: (formData: FormData) => Promise<void>;
  programSlug: string;
  moduleCount: number;
  lessonCount: number;
  accessCount: number;
}) {
  const [typed, setTyped] = useState("");
  const matches = typed.trim() === programSlug;

  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
      <h2 className="text-lg font-semibold text-red-900">Zona de peligro</h2>
      <p className="mt-2 text-sm leading-6 text-red-800">
        Eliminar este programa borra de forma permanente:
      </p>
      <ul className="mt-2 ml-5 list-disc text-sm text-red-800">
        <li>
          {moduleCount} módulo{moduleCount === 1 ? "" : "s"}
        </li>
        <li>
          {lessonCount} lección{lessonCount === 1 ? "" : "es"} (con sus prompts,
          recursos y progreso de usuarios)
        </li>
        <li>
          {accessCount} acceso{accessCount === 1 ? "" : "s"} activo
          {accessCount === 1 ? "" : "s"} — los usuarios perderán acceso a este
          programa
        </li>
      </ul>
      <p className="mt-2 text-sm leading-6 text-red-800">
        Las compras (Purchase) NO se borran; solo se desvinculan. Esta acción no
        se puede deshacer.
      </p>

      <form action={action} className="mt-4 space-y-3">
        <label className="block space-y-2">
          <span className="text-sm font-semibold text-red-900">
            Escribe el slug del programa para confirmar:{" "}
            <code className="rounded bg-white px-1.5 py-0.5 text-xs">
              {programSlug}
            </code>
          </span>
          <input
            name="confirmSlug"
            value={typed}
            onChange={(event) => setTyped(event.target.value)}
            autoComplete="off"
            placeholder={programSlug}
            className="h-11 w-full rounded-md border border-red-300 bg-white px-3 text-sm outline-none transition focus:border-red-500"
          />
        </label>
        <button
          type="submit"
          disabled={!matches}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Eliminar programa permanentemente
        </button>
      </form>
    </div>
  );
}

/**
 * Danger zone for modules/lessons: a single submit button guarded by a
 * native confirm() dialog. Lower stakes than programs.
 */
export function DeleteEntityDangerZone({
  action,
  title,
  description,
  confirmMessage,
  buttonLabel,
}: {
  action: () => Promise<void>;
  title: string;
  description: string;
  confirmMessage: string;
  buttonLabel: string;
}) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
      <h2 className="text-lg font-semibold text-red-900">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-red-800">{description}</p>
      <form
        action={action}
        className="mt-4"
        onSubmit={(event) => {
          if (!window.confirm(confirmMessage)) {
            event.preventDefault();
          }
        }}
      >
        <button
          type="submit"
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          {buttonLabel}
        </button>
      </form>
    </div>
  );
}
