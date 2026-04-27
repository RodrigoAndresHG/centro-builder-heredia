import type { Metadata } from "next";

import { AuthPanel } from "@/components/public/auth-panel";

export const metadata: Metadata = {
  title: "Registro | Builder HeredIA",
  description:
    "Crea tu acceso al LMS oficial de Rodrigo HeredIA y prepárate para el lanzamiento del primer programa.",
};

type RegistroPageProps = {
  searchParams: Promise<{ callbackUrl?: string; intent?: string }>;
};

function normalizeIntent(intent?: string, callbackUrl?: string) {
  if (intent === "buy" || intent === "explore") {
    return intent;
  }

  if (callbackUrl) {
    const callbackIntent = new URL(callbackUrl, "https://builder.local").searchParams.get(
      "intent",
    );

    return callbackIntent === "buy" || callbackIntent === "explore"
      ? callbackIntent
      : undefined;
  }

  return undefined;
}

export default async function RegistroPage({ searchParams }: RegistroPageProps) {
  const { callbackUrl, intent } = await searchParams;

  return (
    <AuthPanel
      mode="registro"
      intent={normalizeIntent(intent, callbackUrl)}
      callbackUrl={callbackUrl}
    />
  );
}
