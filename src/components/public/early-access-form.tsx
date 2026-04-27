"use client";

import { FormEvent, useState } from "react";

import { Reveal } from "@/components/public/reveal";

type EarlyAccessFormProps = {
  source: "home" | "program_build_ideacash";
};

type SubmitState = "idle" | "loading" | "success" | "error";

export function EarlyAccessForm({ source }: EarlyAccessFormProps) {
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    setState("loading");
    setMessage("");

    const formData = new FormData(form);

    try {
      const response = await fetch("/api/early-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          source,
        }),
      });

      const payload = (await response.json()) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error ?? "No pudimos guardar tus datos.");
      }

      setState("success");
      setMessage(
        payload.message ??
          "Quedaste en la lista prioritaria. Te avisaré antes de la apertura.",
      );
      form.reset();
    } catch (error) {
      setState("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "No pudimos guardar tus datos. Intenta nuevamente.",
      );
    }
  }

  const isLoading = state === "loading";
  const isSuccess = state === "success";

  return (
    <Reveal delay={120}>
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-teal-400/20 bg-neutral-950 p-5 shadow-2xl shadow-black/30"
      >
        <div className="mb-5 rounded-xl border border-neutral-800 bg-neutral-900 p-4">
          <p className="text-xs font-semibold uppercase text-teal-300">
            Lista prioritaria
          </p>
          <p className="mt-2 text-lg font-semibold text-white">
            Entra antes de la apertura.
          </p>
          <p className="mt-2 text-sm leading-6 text-neutral-400">
            Nombre y email para recibir el aviso fundador.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-neutral-300">Nombre</span>
            <input
              name="name"
              placeholder="Tu nombre"
              required
              minLength={2}
              disabled={isLoading}
              className="h-12 w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 text-sm text-white outline-none transition duration-300 placeholder:text-neutral-600 focus:border-teal-300 focus:bg-neutral-950 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-neutral-300">Email</span>
            <input
              name="email"
              type="email"
              placeholder="tu@email.com"
              required
              disabled={isLoading}
              className="h-12 w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 text-sm text-white outline-none transition duration-300 placeholder:text-neutral-600 focus:border-teal-300 focus:bg-neutral-950 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-md bg-teal-300 px-5 py-3 text-sm font-semibold text-neutral-950 shadow-lg shadow-teal-950/40 transition duration-300 hover:-translate-y-0.5 hover:bg-teal-200 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? "Guardando acceso..." : "Quiero acceso temprano"}
        </button>

        {message ? (
          <div
            className={`mt-4 rounded-xl border p-4 text-sm leading-6 ${
              isSuccess
                ? "border-teal-400/30 bg-teal-400/10 text-teal-100"
                : "border-red-400/30 bg-red-400/10 text-red-100"
            }`}
          >
            <p className="font-semibold">
              {isSuccess
                ? "Quedaste en la lista prioritaria"
                : "No pudimos guardar tu acceso"}
            </p>
            <p className="mt-1 opacity-85">{message}</p>
          </div>
        ) : null}
      </form>
    </Reveal>
  );
}
