import { describe, expect, it } from "vitest";

import {
  buildRegistroHref,
  computeAttributionUpdate,
  normalizeSrc,
  parseAttributionCookie,
} from "./attribution";

function cookieWith(payload: Record<string, unknown>) {
  return encodeURIComponent(JSON.stringify(payload));
}

describe("normalizeSrc", () => {
  it("devuelve 'bio' cuando no viene nada", () => {
    expect(normalizeSrc(undefined)).toBe("bio");
    expect(normalizeSrc(null)).toBe("bio");
    expect(normalizeSrc("")).toBe("bio");
  });

  it("acepta slugs válidos y los pasa a minúsculas", () => {
    expect(normalizeSrc("tiktok")).toBe("tiktok");
    expect(normalizeSrc("IG")).toBe("ig");
    expect(normalizeSrc("yt_shorts-1")).toBe("yt_shorts-1");
  });

  it("rechaza entradas peligrosas y cae a 'bio'", () => {
    expect(normalizeSrc("tik tok")).toBe("bio");
    expect(normalizeSrc("a&b=c")).toBe("bio");
    expect(normalizeSrc("<script>")).toBe("bio");
    expect(normalizeSrc("x".repeat(21))).toBe("bio");
  });
});

describe("buildRegistroHref", () => {
  it("arma el link con intent y UTMs", () => {
    expect(buildRegistroHref("explore", "tiktok")).toBe(
      "/registro?intent=explore&utm_source=tiktok&utm_medium=bio&utm_campaign=empieza",
    );
  });

  it("mantiene intent=buy y sanea el src", () => {
    expect(buildRegistroHref("buy", "bad src")).toBe(
      "/registro?intent=buy&utm_source=bio&utm_medium=bio&utm_campaign=empieza",
    );
  });
});

describe("parseAttributionCookie", () => {
  it("devuelve null si no hay cookie", () => {
    expect(parseAttributionCookie(undefined)).toBeNull();
    expect(parseAttributionCookie("")).toBeNull();
  });

  it("parsea una cookie válida (URL-encoded)", () => {
    const raw = encodeURIComponent(
      JSON.stringify({
        source: "tiktok",
        medium: "bio",
        campaign: "empieza",
        intent: "explore",
      }),
    );
    expect(parseAttributionCookie(raw)).toEqual({
      source: "tiktok",
      medium: "bio",
      campaign: "empieza",
      intent: "explore",
    });
  });

  it("devuelve null si falta la fuente", () => {
    const raw = encodeURIComponent(JSON.stringify({ medium: "bio" }));
    expect(parseAttributionCookie(raw)).toBeNull();
  });

  it("ignora un intent inválido", () => {
    const raw = encodeURIComponent(
      JSON.stringify({ source: "ig", intent: "hackear" }),
    );
    expect(parseAttributionCookie(raw)?.intent).toBeUndefined();
  });

  it("no explota con JSON corrupto", () => {
    expect(parseAttributionCookie("no-es-json")).toBeNull();
  });
});

describe("computeAttributionUpdate", () => {
  it("escribe utmSource='tiktok' cuando el usuario nuevo no tiene fuente y la cookie trae tiktok/empieza", () => {
    const cookie = cookieWith({
      source: "tiktok",
      medium: "bio",
      campaign: "empieza",
      intent: "explore",
    });

    expect(computeAttributionUpdate(null, cookie)).toEqual({
      utmSource: "tiktok",
      utmMedium: "bio",
      utmCampaign: "empieza",
      signupIntent: "explore",
    });
  });

  it("NO reescribe si el usuario ya tiene fuente (primer toque gana)", () => {
    const cookie = cookieWith({ source: "tiktok", campaign: "empieza" });
    expect(computeAttributionUpdate("instagram", cookie)).toBeNull();
  });

  it("devuelve null si no hay cookie", () => {
    expect(computeAttributionUpdate(null, undefined)).toBeNull();
    expect(computeAttributionUpdate(null, "")).toBeNull();
  });

  it("devuelve null con cookie corrupta o sin fuente", () => {
    expect(computeAttributionUpdate(null, "no-es-json")).toBeNull();
    expect(computeAttributionUpdate(null, cookieWith({ medium: "bio" }))).toBeNull();
  });

  it("rellena medium/campaign/intent en null si faltan", () => {
    const cookie = cookieWith({ source: "ig" });
    expect(computeAttributionUpdate(null, cookie)).toEqual({
      utmSource: "ig",
      utmMedium: null,
      utmCampaign: null,
      signupIntent: null,
    });
  });
});
