import { z } from "zod";

export const checkoutRequestSchema = z
  .object({
    productId: z.string().min(1).optional(),
    productSlug: z.string().min(1).optional(),
  })
  .refine((data) => Boolean(data.productId ?? data.productSlug), {
    message: "Producto requerido para iniciar checkout.",
  });

export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>;

export const stripeCheckoutMetadataSchema = z.object({
  productId: z.string().min(1).optional(),
  productSlug: z.string().min(1).optional(),
  userId: z.string().min(1).optional(),
  userEmail: z.string().email().optional(),
});

export type StripeCheckoutMetadata = z.infer<typeof stripeCheckoutMetadataSchema>;
