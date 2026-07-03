import { describe, expect, it } from "vitest";

import {
  getOnboardingEmailCount,
  renderOnboardingEmail,
  SEQUENCE_LENGTH,
} from "./onboarding-emails";

const OPTS = { baseUrl: "https://builder.rodriheredia.com", unsubscribeToken: "tok123" };

describe("secuencia de onboarding", () => {
  it("tiene exactamente 5 correos", () => {
    expect(getOnboardingEmailCount()).toBe(5);
    expect(SEQUENCE_LENGTH).toBe(5);
  });

  it("E1 usa el asunto y CTA al curso con utm_source=email + utm_content=email1", () => {
    const { subject, html } = renderOnboardingEmail(0, OPTS);
    expect(subject).toBe("Ya estás dentro. Empieza por aquí.");
    expect(html).toContain("utm_source=email");
    expect(html).toContain("utm_medium=sequence");
    expect(html).toContain("utm_campaign=onboarding");
    expect(html).toContain("utm_content=email1");
    expect(html).toContain("/app?");
  });

  it("E4 (tripwire) apunta a la compra en /app/programas con utm_content=email4", () => {
    const { subject, html } = renderOnboardingEmail(3, OPTS);
    expect(subject).toBe("Deja de aprender IA. Construye tu primera.");
    expect(html).toContain("/app/programas?");
    expect(html).toContain("utm_content=email4");
  });

  it("incluye el link de baja con el token en el pie", () => {
    const { html } = renderOnboardingEmail(0, OPTS);
    expect(html).toContain("/unsubscribe?token=tok123");
  });

  it("lanza si el step no existe", () => {
    expect(() => renderOnboardingEmail(5, OPTS)).toThrow();
  });
});
