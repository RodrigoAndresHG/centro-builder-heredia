import { z } from "zod";

export const promptPlatforms = ["CLAUDE", "CHATGPT", "GEMINI", "MULTI"] as const;
export type PromptPlatformValue = (typeof promptPlatforms)[number];

export const promptAssetInputSchema = z.object({
  title: z.string().trim().min(1, "El título del prompt es requerido.").max(200),
  category: z
    .string()
    .trim()
    .min(1, "La categoría es requerida (ej: Marketing, Código).")
    .max(60),
  description: z
    .string()
    .trim()
    .max(500)
    .optional()
    .transform((value) => (value && value.length > 0 ? value : null)),
  body: z
    .string()
    .trim()
    .min(1, "El cuerpo del prompt es requerido.")
    .max(20000),
  platform: z.enum(promptPlatforms, {
    message: "Plataforma no válida.",
  }),
  isPremium: z.boolean(),
  isPublished: z.boolean(),
  sortOrder: z.number().int().default(0),
});

export type PromptAssetInput = z.infer<typeof promptAssetInputSchema>;
