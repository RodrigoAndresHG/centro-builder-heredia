import { describe, expect, it } from "vitest";

import { promptAssetInputSchema } from "./prompt-asset";

const validInput = {
  title: "Resumen ejecutivo de noticias",
  category: "Productividad",
  description: "Convierte un artículo largo en 5 bullets accionables.",
  body: "Eres un analista. Resume el siguiente texto en 5 bullets...",
  platform: "CLAUDE" as const,
  isPremium: false,
  isPublished: true,
  sortOrder: 0,
};

describe("promptAssetInputSchema", () => {
  it("acepta un prompt válido", () => {
    const result = promptAssetInputSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("rechaza título vacío", () => {
    const result = promptAssetInputSchema.safeParse({ ...validInput, title: "  " });
    expect(result.success).toBe(false);
  });

  it("rechaza categoría vacía", () => {
    const result = promptAssetInputSchema.safeParse({ ...validInput, category: "" });
    expect(result.success).toBe(false);
  });

  it("rechaza plataforma desconocida", () => {
    const result = promptAssetInputSchema.safeParse({
      ...validInput,
      platform: "GROK",
    });
    expect(result.success).toBe(false);
  });

  it("acepta las cuatro plataformas válidas", () => {
    for (const platform of ["CLAUDE", "CHATGPT", "GEMINI", "MULTI"] as const) {
      const result = promptAssetInputSchema.safeParse({ ...validInput, platform });
      expect(result.success).toBe(true);
    }
  });

  it("normaliza descripción vacía a null", () => {
    const result = promptAssetInputSchema.safeParse({
      ...validInput,
      description: "   ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.description).toBeNull();
    }
  });

  it("rechaza body vacío", () => {
    const result = promptAssetInputSchema.safeParse({ ...validInput, body: "" });
    expect(result.success).toBe(false);
  });
});
