import { z } from "zod";

const stripePriceIdSchema = z
  .string()
  .trim()
  .regex(
    /^price_[A-Za-z0-9]+$/,
    "Stripe Price ID debe empezar con 'price_' seguido de letras o números.",
  );

export const productInputSchema = z.object({
  name: z.string().trim().min(2, "El nombre del producto es requerido."),
  slug: z
    .string()
    .trim()
    .min(2, "El slug es requerido."),
  description: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .transform((value) => (value && value.length > 0 ? value : null)),
  stripePriceId: z
    .string()
    .trim()
    .transform((value) => (value.length > 0 ? value : null))
    .pipe(
      z
        .union([z.null(), stripePriceIdSchema])
        .nullable(),
    ),
  isActive: z.boolean(),
});

export type ProductInput = z.infer<typeof productInputSchema>;
