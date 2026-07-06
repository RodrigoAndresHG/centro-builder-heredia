import { describe, expect, it } from "vitest";

import { computeStreak } from "./streak";

// "Hoy" de referencia: 5-jul-2026 14:00 en Ecuador (19:00 UTC).
const NOW = new Date("2026-07-05T19:00:00.000Z");

// Instante dentro del día indicado en hora de Ecuador (UTC-5, sin DST).
const ecuadorDay = (day: string, hour = 12) =>
  new Date(`${day}T${String(hour + 5).padStart(2, "0")}:00:00.000Z`);

describe("computeStreak", () => {
  it("sin actividad → todo en cero", () => {
    expect(computeStreak([], NOW)).toEqual({
      current: 0,
      longest: 0,
      activeToday: false,
    });
  });

  it("una lección hoy → racha de 1, activa hoy", () => {
    const result = computeStreak([ecuadorDay("2026-07-05")], NOW);
    expect(result).toEqual({ current: 1, longest: 1, activeToday: true });
  });

  it("3 días consecutivos terminando hoy → racha de 3", () => {
    const dates = [
      ecuadorDay("2026-07-03"),
      ecuadorDay("2026-07-04"),
      ecuadorDay("2026-07-05"),
    ];
    expect(computeStreak(dates, NOW)).toEqual({
      current: 3,
      longest: 3,
      activeToday: true,
    });
  });

  it("racha que terminó ayer sigue viva (hoy pendiente)", () => {
    const dates = [ecuadorDay("2026-07-03"), ecuadorDay("2026-07-04")];
    expect(computeStreak(dates, NOW)).toEqual({
      current: 2,
      longest: 2,
      activeToday: false,
    });
  });

  it("racha rota (última actividad antier) → current 0, longest conserva", () => {
    const dates = [ecuadorDay("2026-07-01"), ecuadorDay("2026-07-02"), ecuadorDay("2026-07-03")];
    expect(computeStreak(dates, NOW)).toEqual({
      current: 0,
      longest: 3,
      activeToday: false,
    });
  });

  it("varias lecciones el mismo día cuentan como un solo día", () => {
    const dates = [
      ecuadorDay("2026-07-05", 8),
      ecuadorDay("2026-07-05", 10),
      ecuadorDay("2026-07-05", 13),
    ];
    expect(computeStreak(dates, NOW)).toEqual({
      current: 1,
      longest: 1,
      activeToday: true,
    });
  });

  it("longest detecta la corrida histórica más larga aunque la actual sea corta", () => {
    const dates = [
      ecuadorDay("2026-06-01"),
      ecuadorDay("2026-06-02"),
      ecuadorDay("2026-06-03"),
      ecuadorDay("2026-06-04"),
      ecuadorDay("2026-07-05"),
    ];
    expect(computeStreak(dates, NOW)).toEqual({
      current: 1,
      longest: 4,
      activeToday: true,
    });
  });

  it("frontera de zona horaria: 23:30 en Ecuador es el MISMO día (aunque en UTC ya sea mañana)", () => {
    // 2026-07-04 23:30 Ecuador = 2026-07-05 04:30 UTC
    const lateNight = new Date("2026-07-05T04:30:00.000Z");
    const result = computeStreak([lateNight], NOW);
    // Cuenta como actividad del 4-jul → racha viva de 1, hoy pendiente.
    expect(result).toEqual({ current: 1, longest: 1, activeToday: false });
  });
});
