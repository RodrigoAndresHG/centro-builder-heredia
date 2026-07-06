import { z } from "zod";

// Contexto opcional: la lección que el usuario está viendo. El servidor
// SIEMPRE re-valida el acceso antes de inyectar el contenido al prompt.
const lessonContextSchema = z.object({
  programSlug: z.string().trim().min(1).max(120),
  lessonSlug: z.string().trim().min(1).max(120),
});

// Historial de chat que envía el cliente. El último mensaje debe ser del
// usuario; se limita cantidad y largo para acotar costo y abuso.
export const assistantChatSchema = z
  .object({
    messages: z
      .array(
        z.object({
          role: z.enum(["user", "assistant"]),
          content: z.string().trim().min(1).max(1500),
        }),
      )
      .min(1)
      .max(12),
    lessonContext: lessonContextSchema.optional(),
  })
  .refine(
    (data) => data.messages[data.messages.length - 1]?.role === "user",
    { message: "El último mensaje debe ser del usuario." },
  );

export type AssistantChatInput = z.infer<typeof assistantChatSchema>;
