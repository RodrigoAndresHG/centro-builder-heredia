import { describe, expect, it } from "vitest";

import { computeNextSendAt, computeSentTransition } from "./email-sequence";

const CREATED = new Date("2026-07-03T14:00:00.000Z");
const DAY = 24 * 60 * 60 * 1000;

describe("computeNextSendAt", () => {
  it("ancla cada step a la fecha de inscripción (0,1,3,5,7 días)", () => {
    expect(computeNextSendAt(CREATED, 0).getTime()).toBe(CREATED.getTime());
    expect(computeNextSendAt(CREATED, 1).getTime()).toBe(CREATED.getTime() + 1 * DAY);
    expect(computeNextSendAt(CREATED, 2).getTime()).toBe(CREATED.getTime() + 3 * DAY);
    expect(computeNextSendAt(CREATED, 3).getTime()).toBe(CREATED.getTime() + 5 * DAY);
    expect(computeNextSendAt(CREATED, 4).getTime()).toBe(CREATED.getTime() + 7 * DAY);
  });
});

describe("computeSentTransition", () => {
  it("avanza de step 0 a step 1 (pending) con nextSendAt en día 1", () => {
    const t = computeSentTransition(0, CREATED);
    expect(t).toMatchObject({ step: 1, status: "pending" });
    expect(t.nextSendAt.getTime()).toBe(CREATED.getTime() + 1 * DAY);
  });

  it("avanza de step 3 a step 4 (pending) con nextSendAt en día 7", () => {
    const t = computeSentTransition(3, CREATED);
    expect(t).toMatchObject({ step: 4, status: "pending" });
    expect(t.nextSendAt.getTime()).toBe(CREATED.getTime() + 7 * DAY);
  });

  it("al enviar el último correo (step 4) marca done", () => {
    const t = computeSentTransition(4, CREATED);
    expect(t.step).toBe(5);
    expect(t.status).toBe("done");
  });
});
