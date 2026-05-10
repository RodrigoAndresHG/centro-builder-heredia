import { z } from "zod";

export const earlyAccessSources = ["home", "program_build_ideacash"] as const;

export const earlyAccessRequestSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Ingresa tu nombre para reservar acceso temprano."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Ingresa un email válido."),
  source: z.enum(earlyAccessSources, {
    message: "Fuente de acceso temprano no válida.",
  }),
});

export type EarlyAccessRequest = z.infer<typeof earlyAccessRequestSchema>;
