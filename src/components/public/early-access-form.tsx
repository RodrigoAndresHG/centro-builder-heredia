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
        className="rounded-2xl border border-white/10 bg-[#0c1019] p-5 shadow-2xl shadow-black/40"
      >
        <div className="mb-5 rounded-xl border border-white/10 bg-[#10151f] p-4">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-sky-400">
            Lista prioritaria
          </p>
          <p className="mt-2 text-lg font-medium text-[#eef2f7]">
            Entra antes de la apertura.
          </p>
          <p className="mt-2 text-sm leading-6 text-[#aab6c6]">
            Nombre y email para recibir el aviso fundador.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-[#aab6c6]">Nombre</span>
            <input
              name="name"
              placeholder="Tu nombre"
              required
              minLength={2}
              disabled={isLoading}
              className="h-12 w-full rounded-md border border-white/10 bg-[#10151f] px-3 text-sm text-white outline-none transition duration-300 placeholder:text-[#5b6879] focus:border-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-[#aab6c6]">Email</span>
            <input
              name="email"
              type="email"
              placeholder="tu@email.com"
              required
              disabled={isLoading}
              className="h-12 w-full rounded-md border border-white/10 bg-[#10151f] px-3 text-sm text-white outline-none transition duration-300 placeholder:text-[#5b6879] focus:border-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn btn--primary mt-5 w-full justify-center disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? "Guardando acceso..." : "Quiero acceso prioritario"}
        </button>

        {message ? (
          <div
            className={`mt-4 rounded-xl border p-4 text-sm leading-6 ${
              isSuccess
                ? "border-sky-400/30 bg-sky-400/10 text-sky-100"
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
