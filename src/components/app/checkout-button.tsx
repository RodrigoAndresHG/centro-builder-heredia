"use client";

import { useState } from "react";

type CheckoutButtonProps = {
  productSlug: string;
  label?: string;
};

export function CheckoutButton({
  productSlug,
  label = "Comprar acceso",
}: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout() {
    setIsLoading(true);
    setError(null);

    const response = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productSlug }),
    });
    const data = (await response.json().catch(() => null)) as {
      url?: string;
      error?: string;
    } | null;

    if (!response.ok || !data?.url) {
      setError(data?.error ?? "No se pudo iniciar el pago.");
      setIsLoading(false);
      return;
    }

    window.location.href = data.url;
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={startCheckout}
        disabled={isLoading}
        className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Abriendo checkout..." : label}
      </button>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
