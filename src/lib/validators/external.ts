import { z } from "zod";

// Registro de usuarios desde apps externas (PronostiGol u otras del
// ecosistema) vía POST /api/external/registro.
export const externalRegistroSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("El correo no es válido.")
    .max(200, "El correo es demasiado largo."),
  signupSource: z
    .string()
    .trim()
    .min(1, "Falta el origen del registro (signupSource).")
    .max(60, "El origen del registro es demasiado largo."),
  partidoId: z
    .string()
    .trim()
    .min(1)
    .max(60, "El identificador de partido es demasiado largo.")
    .optional(),
});

export type ExternalRegistroInput = z.infer<typeof externalRegistroSchema>;
