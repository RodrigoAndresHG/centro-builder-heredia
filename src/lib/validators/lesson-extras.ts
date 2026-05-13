import { z } from "zod";

export const promptInputSchema = z.object({
  title: z.string().trim().min(1, "El título del prompt es requerido.").max(200),
  body: z
    .string()
    .trim()
    .min(1, "El cuerpo del prompt es requerido.")
    .max(20000),
  sortOrder: z.number().int().default(0),
});

export type PromptInput = z.infer<typeof promptInputSchema>;

export const lessonResourceTypes = ["LINK", "DOWNLOAD", "REFERENCE"] as const;
export type LessonResourceTypeValue = (typeof lessonResourceTypes)[number];

export const resourceInputSchema = z.object({
  title: z.string().trim().min(1, "El título del recurso es requerido.").max(200),
  description: z
    .string()
    .trim()
    .max(500)
    .optional()
    .transform((value) => (value && value.length > 0 ? value : null)),
  url: z
    .string()
    .trim()
    .min(1, "La URL del recurso es requerida.")
    .url("La URL del recurso debe ser una URL válida (https://...)."),
  type: z.enum(lessonResourceTypes, {
    message: "Tipo de recurso no válido.",
  }),
  sortOrder: z.number().int().default(0),
});

export type ResourceInput = z.infer<typeof resourceInputSchema>;
