import { describe, expect, it } from "vitest";

import { assistantChatSchema } from "./assistant";

describe("assistantChatSchema", () => {
  it("acepta un historial válido que termina en mensaje de usuario", () => {
    const result = assistantChatSchema.safeParse({
      messages: [
        { role: "user", content: "¿Cómo activo mi acceso?" },
        { role: "assistant", content: "Desde Programas..." },
        { role: "user", content: "¿Y si ya pagué?" },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("rechaza si el último mensaje no es del usuario", () => {
    const result = assistantChatSchema.safeParse({
      messages: [
        { role: "user", content: "Hola" },
        { role: "assistant", content: "Hola, ¿en qué te ayudo?" },
      ],
    });
    expect(result.success).toBe(false);
  });

  it("rechaza mensajes vacíos", () => {
    const result = assistantChatSchema.safeParse({
      messages: [{ role: "user", content: "   " }],
    });
    expect(result.success).toBe(false);
  });

  it("rechaza más de 12 mensajes", () => {
    const messages = Array.from({ length: 13 }, (_, index) => ({
      role: index % 2 === 0 ? ("user" as const) : ("assistant" as const),
      content: `Mensaje ${index}`,
    }));
    const result = assistantChatSchema.safeParse({ messages });
    expect(result.success).toBe(false);
  });

  it("rechaza contenido que excede 1500 caracteres", () => {
    const result = assistantChatSchema.safeParse({
      messages: [{ role: "user", content: "x".repeat(1501) }],
    });
    expect(result.success).toBe(false);
  });

  it("rechaza roles desconocidos", () => {
    const result = assistantChatSchema.safeParse({
      messages: [{ role: "system", content: "hack" }],
    });
    expect(result.success).toBe(false);
  });

  it("acepta lessonContext válido", () => {
    const result = assistantChatSchema.safeParse({
      messages: [{ role: "user", content: "Explícame esta lección" }],
      lessonContext: {
        programSlug: "claude-desde-cero",
        lessonSlug: "que-es-claude",
      },
    });
    expect(result.success).toBe(true);
  });

  it("rechaza lessonContext incompleto", () => {
    const result = assistantChatSchema.safeParse({
      messages: [{ role: "user", content: "Hola" }],
      lessonContext: { programSlug: "claude-desde-cero" },
    });
    expect(result.success).toBe(false);
  });

  it("sigue aceptando peticiones sin lessonContext", () => {
    const result = assistantChatSchema.safeParse({
      messages: [{ role: "user", content: "¿Cómo guardo mi progreso?" }],
    });
    expect(result.success).toBe(true);
  });
});
