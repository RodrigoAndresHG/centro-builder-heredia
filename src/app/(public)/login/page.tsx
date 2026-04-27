import type { Metadata } from "next";

import { AuthPanel } from "@/components/public/auth-panel";

export const metadata: Metadata = {
  title: "Acceso | Builder HeredIA",
  description:
    "Entra al LMS oficial de Rodrigo HeredIA y continúa dentro de tu entorno privado.",
};

type LoginPageProps = {
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

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { callbackUrl, intent } = await searchParams;

  return (
    <AuthPanel
      mode="login"
      intent={normalizeIntent(intent, callbackUrl)}
      callbackUrl={callbackUrl}
    />
  );
}
