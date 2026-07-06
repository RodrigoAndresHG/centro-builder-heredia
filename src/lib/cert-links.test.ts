import { describe, expect, it } from "vitest";

import { buildLinkedInAddUrl, buildWhatsappShareUrl } from "./cert-links";

const ISSUED = new Date("2026-07-05T15:00:00.000Z");

describe("buildLinkedInAddUrl", () => {
  it("arma el deep link de 'Añadir a mi perfil' con todos los campos", () => {
    const url = new URL(
      buildLinkedInAddUrl({
        programTitle: "Claude desde Cero",
        certUrl: "https://builder.rodriheredia.com/cert/abc123",
        certCode: "abc123",
        issuedAt: ISSUED,
      }),
    );

    expect(url.origin + url.pathname).toBe("https://www.linkedin.com/profile/add");
    expect(url.searchParams.get("startTask")).toBe("CERTIFICATION_NAME");
    expect(url.searchParams.get("name")).toBe("Claude desde Cero");
    expect(url.searchParams.get("organizationName")).toBe("Builder HeredIA");
    expect(url.searchParams.get("issueYear")).toBe("2026");
    expect(url.searchParams.get("issueMonth")).toBe("7");
    expect(url.searchParams.get("certUrl")).toBe(
      "https://builder.rodriheredia.com/cert/abc123",
    );
    expect(url.searchParams.get("certId")).toBe("abc123");
  });
});

describe("buildWhatsappShareUrl", () => {
  it("codifica el texto con el título y la URL del certificado", () => {
    const url = buildWhatsappShareUrl({
      programTitle: "Agente de Noticias de IA",
      certUrl: "https://builder.rodriheredia.com/cert/xyz",
    });

    expect(url.startsWith("https://wa.me/?text=")).toBe(true);
    const decoded = decodeURIComponent(url.split("?text=")[1]);
    expect(decoded).toContain("Agente de Noticias de IA");
    expect(decoded).toContain("https://builder.rodriheredia.com/cert/xyz");
  });
});
