import { describe, expect, it } from "vitest";

import { externalRegistroSchema } from "./external";

describe("externalRegistroSchema", () => {
  it("acepta un registro válido con email y signupSource", () => {
    const result = externalRegistroSchema.safeParse({
      email: "jugador@correo.com",
      signupSource: "pronostigol-juego",
    });
    expect(result.success).toBe(true);
  });

  it("normaliza el email (trim + minúsculas)", () => {
    const result = externalRegistroSchema.safeParse({
      email: "  Jugador@Correo.COM  ",
      signupSource: "pronostigol-juego",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("jugador@correo.com");
    }
  });

  it("acepta partidoId opcional", () => {
    const result = externalRegistroSchema.safeParse({
      email: "jugador@correo.com",
      signupSource: "pronostigol-juego",
      partidoId: "ECU-ARG-2026",
    });
    expect(result.success).toBe(true);
  });

  it("rechaza un email inválido", () => {
    const result = externalRegistroSchema.safeParse({
      email: "no-es-un-correo",
      signupSource: "pronostigol-juego",
    });
    expect(result.success).toBe(false);
  });

  it("rechaza si falta signupSource", () => {
    const result = externalRegistroSchema.safeParse({
      email: "jugador@correo.com",
    });
    expect(result.success).toBe(false);
  });

  it("rechaza signupSource vacío", () => {
    const result = externalRegistroSchema.safeParse({
      email: "jugador@correo.com",
      signupSource: "   ",
    });
    expect(result.success).toBe(false);
  });
});
