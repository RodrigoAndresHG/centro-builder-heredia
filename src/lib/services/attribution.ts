import { prisma } from "@/lib/db/prisma";
import type { AttributionInput } from "@/lib/validators/attribution";

/**
 * Registra un click entrante atribuido (p. ej. PronostiGol → /registro). Es un
 * log append-only: una fila por llegada con UTMs, aunque no complete el
 * registro. La atribución de la CUENTA (una vez creada) vive en User.
 */
export async function recordAttributionEvent(
  input: AttributionInput,
  meta?: { userAgent?: string | null },
) {
  return prisma.attributionEvent.create({
    data: {
      source: input.source,
      medium: input.medium ?? null,
      campaign: input.campaign ?? null,
      content: input.content ?? null,
      intent: input.intent ?? null,
      path: input.path ?? null,
      userAgent: meta?.userAgent ?? null,
    },
  });
}
