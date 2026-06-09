import { redirect } from "next/navigation";

import {
  PromptLibrary,
  type LibraryPrompt,
} from "@/components/app/prompt-library";
import {
  WorkspaceCard,
  WorkspaceHero,
  WorkspaceTrail,
} from "@/components/app/workspace-card";
import { auth } from "@/lib/auth";
import { isAdminRole } from "@/lib/permissions";
import { listPublishedPromptAssets } from "@/lib/services";

export default async function BibliotecaPage() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    redirect("/login?callbackUrl=/app/biblioteca");
  }

  // Premium se desbloquea con cualquier compra (rol USUARIO_PAGO) o admin.
  const canSeePremium =
    user.role === "USUARIO_PAGO" || isAdminRole(user.role);

  const promptAssets = await listPublishedPromptAssets();

  // El cuerpo de los prompts premium NUNCA viaja al cliente si el usuario
  // no tiene acceso — se vacía del lado servidor.
  const prompts: LibraryPrompt[] = promptAssets.map((asset) => {
    const locked = asset.isPremium && !canSeePremium;

    return {
      id: asset.id,
      title: asset.title,
      description: asset.description,
      body: locked ? "" : asset.body,
      platform: asset.platform,
      category: asset.category,
      locked,
    };
  });

  const categoryCount = new Set(prompts.map((prompt) => prompt.category)).size;

  return (
    <div className="space-y-8">
      <WorkspaceTrail
        items={[{ label: "Workspace", href: "/app" }, { label: "Biblioteca" }]}
      />

      <WorkspaceHero
        eyebrow="Biblioteca Builder"
        title="Prompts listos para copiar y usar"
        description="Prompts probados para Claude, ChatGPT y Gemini, organizados por categoría. Copia con un toque y pégalos en tu herramienta favorita."
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
              Prompts
            </p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {prompts.length}
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
              Categorías
            </p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {categoryCount}
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
              Plataformas
            </p>
            <p className="mt-2 text-2xl font-semibold text-white">
              Claude · GPT · Gemini
            </p>
          </div>
        </div>
      </WorkspaceHero>

      {prompts.length === 0 ? (
        <WorkspaceCard>
          <p className="text-sm leading-7 text-neutral-300">
            La biblioteca está en preparación. Muy pronto encontrarás aquí
            prompts listos para usar — te avisaré por el canal de WhatsApp.
          </p>
        </WorkspaceCard>
      ) : (
        <PromptLibrary prompts={prompts} />
      )}
    </div>
  );
}
