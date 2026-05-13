import { describe, expect, it } from "vitest";

import { promptInputSchema, resourceInputSchema } from "./lesson-extras";

describe("promptInputSchema", () => {
  it("acepta un prompt válido con sortOrder por defecto", () => {
    const result = promptInputSchema.safeParse({
      title: "Prompt 1",
      body: "Texto del prompt",
      sortOrder: 0,
    });

    expect(result.success).toBe(true);
  });

  it("rechaza título vacío", () => {
    const result = promptInputSchema.safeParse({
      title: "",
      body: "Texto",
      sortOrder: 0,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toMatch(/título/i);
    }
  });

  it("rechaza body vacío", () => {
    const result = promptInputSchema.safeParse({
      title: "Prompt 1",
      body: "",
      sortOrder: 0,
    });

    expect(result.success).toBe(false);
  });

  it("aplica trim al title y al body", () => {
    const result = promptInputSchema.safeParse({
      title: "   Prompt limpio   ",
      body: "   contenido   ",
      sortOrder: 5,
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe("Prompt limpio");
      expect(result.data.body).toBe("contenido");
      expect(result.data.sortOrder).toBe(5);
    }
  });
});

describe("resourceInputSchema", () => {
  const validResource = {
    title: "Recurso",
    description: "Descripción opcional",
    url: "https://example.com/file.pdf",
    type: "LINK" as const,
    sortOrder: 0,
  };

  it("acepta un recurso válido", () => {
    const result = resourceInputSchema.safeParse(validResource);
    expect(result.success).toBe(true);
  });

  it("rechaza URL no válida", () => {
    const result = resourceInputSchema.safeParse({
      ...validResource,
      url: "no-es-url",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toMatch(/URL/i);
    }
  });

  it("rechaza tipo de recurso desconocido", () => {
    const result = resourceInputSchema.safeParse({
      ...validResource,
      type: "INVALID_TYPE",
    });
    expect(result.success).toBe(false);
  });

  it("normaliza descripción vacía a null", () => {
    const result = resourceInputSchema.safeParse({
      ...validResource,
      description: "   ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.description).toBeNull();
    }
  });

  it("acepta los tres tipos válidos: LINK, DOWNLOAD, REFERENCE", () => {
    for (const type of ["LINK", "DOWNLOAD", "REFERENCE"] as const) {
      const result = resourceInputSchema.safeParse({ ...validResource, type });
      expect(result.success).toBe(true);
    }
  });
});
