import { z } from "zod";

/**
 * Payload de atribución que /registro envía a /api/attribution cuando el
 * tráfico llega con UTMs (p. ej. desde PronostiGol). Todo es opcional salvo
 * `source`, que es la fuente (utm_source).
 */
export const attributionSchema = z.object({
  source: z.string().trim().min(1).max(64),
  medium: z.string().trim().max(64).nullish(),
  campaign: z.string().trim().max(64).nullish(),
  content: z.string().trim().max(160).nullish(),
  intent: z.enum(["explore", "buy"]).nullish(),
  path: z.string().trim().max(256).nullish(),
});

export type AttributionInput = z.infer<typeof attributionSchema>;
