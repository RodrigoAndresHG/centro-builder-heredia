import { describe, expect, it } from "vitest";

import { attributionSchema } from "./attribution";
import { parseAttributionCookie } from "@/lib/attribution/cookie";

describe("attributionSchema", () => {
  it("acepta la atribución típica de PronostiGol", () => {
    const result = attributionSchema.safeParse({
      source: "pronostigol",
      medium: "app",
      campaign: "mundial",
      content: "inicio",
      intent: "explore",
      path: "/registro",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.source).toBe("pronostigol");
      expect(result.data.intent).toBe("explore");
    }
  });

  it("acepta solo source (el resto es opcional)", () => {
    expect(attributionSchema.safeParse({ source: "pronostigol" }).success).toBe(
      true,
    );
  });

  it("rechaza source vacío", () => {
    expect(attributionSchema.safeParse({ source: "" }).success).toBe(false);
  });

  it("rechaza intent fuera del enum", () => {
    expect(
      attributionSchema.safeParse({ source: "x", intent: "hackear" }).success,
    ).toBe(false);
  });
});

describe("parseAttributionCookie", () => {
  it("parsea una cookie válida", () => {
    const parsed = parseAttributionCookie(
      JSON.stringify({ source: "pronostigol", medium: "app" }),
    );
    expect(parsed?.source).toBe("pronostigol");
  });

  it("devuelve null ante cookie vacía o corrupta", () => {
    expect(parseAttributionCookie(undefined)).toBeNull();
    expect(parseAttributionCookie("no-es-json")).toBeNull();
    expect(parseAttributionCookie(JSON.stringify({ medium: "app" }))).toBeNull();
  });
});
