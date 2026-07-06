import { describe, expect, it } from "vitest";

import {
  canSendNudgeGivenDrip,
  isWithinNudgeWindow,
} from "./reactivation";

const NOW = new Date("2026-07-05T14:00:00.000Z");
const daysAgo = (days: number) =>
  new Date(NOW.getTime() - days * 24 * 60 * 60 * 1000);
const hoursAgo = (hours: number) =>
  new Date(NOW.getTime() - hours * 60 * 60 * 1000);

describe("canSendNudgeGivenDrip", () => {
  it("bloquea si el usuario se dio de baja (unsubscribe compartido)", () => {
    expect(
      canSendNudgeGivenDrip(
        { status: "unsubscribed", lastSentAt: null, attempts: 0 },
        NOW,
      ),
    ).toBe(false);
  });

  it("bloquea mientras el drip sigue en vuelo (pending)", () => {
    expect(
      canSendNudgeGivenDrip(
        { status: "pending", lastSentAt: daysAgo(5), attempts: 0 },
        NOW,
      ),
    ).toBe(false);
  });

  it("bloquea un drip fallido que AÚN va a reintentar (attempts < tope)", () => {
    expect(
      canSendNudgeGivenDrip(
        { status: "failed", lastSentAt: hoursAgo(100), attempts: 1 },
        NOW,
      ),
    ).toBe(false);
  });

  it("difiere si el drip envió un correo hace menos de 72h", () => {
    expect(
      canSendNudgeGivenDrip(
        { status: "done", lastSentAt: hoursAgo(48), attempts: 0 },
        NOW,
      ),
    ).toBe(false);
  });

  it("permite si el drip terminó y el último correo fue hace más de 72h", () => {
    expect(
      canSendNudgeGivenDrip(
        { status: "done", lastSentAt: hoursAgo(96), attempts: 0 },
        NOW,
      ),
    ).toBe(true);
  });

  it("permite si el drip terminó y nunca envió (usuarios pre-drip)", () => {
    expect(
      canSendNudgeGivenDrip(
        { status: "done", lastSentAt: null, attempts: 0 },
        NOW,
      ),
    ).toBe(true);
  });

  it("permite tras un drip fallido AGOTADO (attempts al tope) con espaciado", () => {
    expect(
      canSendNudgeGivenDrip(
        { status: "failed", lastSentAt: hoursAgo(100), attempts: 3 },
        NOW,
      ),
    ).toBe(true);
  });
});

describe("isWithinNudgeWindow", () => {
  it("rechaza actividad de hace menos de 6 días (aún activo)", () => {
    expect(isWithinNudgeWindow(daysAgo(3), NOW)).toBe(false);
  });

  it("acepta entre 6 y 30 días", () => {
    expect(isWithinNudgeWindow(daysAgo(6), NOW)).toBe(true);
    expect(isWithinNudgeWindow(daysAgo(15), NOW)).toBe(true);
    expect(isWithinNudgeWindow(daysAgo(30), NOW)).toBe(true);
  });

  it("rechaza más de 30 días (demasiado frío)", () => {
    expect(isWithinNudgeWindow(daysAgo(31), NOW)).toBe(false);
  });
});
