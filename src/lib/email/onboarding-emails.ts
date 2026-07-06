// Contenido y render de la secuencia de onboarding (5 correos / 7 días).
// El copy es EXACTAMENTE el aprobado. Cadencia por step (índice del próximo
// correo a enviar): E1→día 0, E2→día 1, E3→día 3, E4→día 5, E5→día 7.

export const SEQUENCE_LENGTH = 5;
export const SEQUENCE_DAY_OFFSETS = [0, 1, 3, 5, 7] as const;

type CtaTarget = "course" | "buy";

type OnboardingEmail = {
  subject: string;
  paragraphs: string[];
  ctaLabel: string;
  ctaTarget: CtaTarget;
  closing: string[];
};

const EMAILS: OnboardingEmail[] = [
  {
    subject: "Ya estás dentro. Empieza por aquí.",
    paragraphs: [
      'Bienvenido. Ya tienes acceso a "Claude desde Cero" — tu punto de partida para construir con IA, no para juntar tutoriales.',
      "Rápido, para que sepas con quién hablas: no soy un gurú de IA. Soy CIO, dirijo un equipo de tecnología y construyo productos reales combinando tres IAs a la vez —OpenAI, Claude y Gemini—. Eso es lo que vas a aprender aquí.",
      'Tu único paso hoy: la lección 1. Toma pocos minutos y sales con algo que casi nadie que "usa IA" entiende.',
    ],
    ctaLabel: "Empezar la lección 1 →",
    ctaTarget: "course",
    closing: ["Mañana te escribo con la idea que cambia todo.", "Rodrigo"],
  },
  {
    subject: "Una IA te responde. Tres te dicen la verdad.",
    paragraphs: [
      "¿Ya viste la lección 1? Si no, empieza aquí — lo de hoy tiene más sentido después.",
      "La idea central de todo lo que hago:",
      "Cuando le preguntas a UNA sola IA, te da una respuesta y suena segura. El problema es que no sabes si tiene razón, o solo está segura.",
      "Cuando le haces la misma pregunta a tres y las pones a discutir, se contradicen. Y en esa contradicción aparece lo que una sola te habría ocultado.",
      'No se trata de encontrar "la mejor IA". Se trata de orquestarlas para decidir mejor. Eso es Builder Multi-IA — y lo vas a construir con tus manos.',
    ],
    ctaLabel: "Seguir en el curso →",
    ctaTarget: "course",
    closing: ["Rodrigo"],
  },
  {
    subject: "El error que casi rompe mi primer producto con IA",
    paragraphs: [
      "Te cuento algo que no sale en los tutoriales.",
      "La primera vez que conecté tres IAs en un producto, lo hice mal: las puse a responder lo mismo, sin roles. Resultado: ruido. Tres respuestas parecidas que no sumaban nada.",
      "El fix no fue técnico, fue de diseño: darle a cada una un rol distinto. Una propone, otra critica, otra mejora. Ahí el sistema empezó a pensar mejor que cualquiera de las tres por separado.",
      "La lección: la IA no arregla un mal diseño, lo acelera. Primero el criterio, después el modelo.",
      'Eso separa a quien "usa IA" de quien construye con ella.',
    ],
    ctaLabel: "Continuar aprendiendo →",
    ctaTarget: "course",
    closing: ["Rodrigo"],
  },
  {
    subject: "Deja de aprender IA. Construye tu primera.",
    paragraphs: [
      "Ya tienes la idea. Ahora toca construir.",
      "Preparé un curso corto y directo: Crea tu Agente de Noticias de IA en 1 Hora. No es teoría — al final tienes un agente real, funcionando, que detecta noticias de IA y te las entrega listas. Tu primer producto de verdad.",
      "Lo hice para que cruces la línea que casi nadie cruza: pasar de consumir IA a construir con ella. En una hora.",
      "Cuesta $9.99. Menos que un almuerzo, y sales con algo que es tuyo.",
    ],
    ctaLabel: "Construir mi agente — $9.99 →",
    ctaTarget: "buy",
    closing: ["Rodrigo"],
  },
  {
    subject: "De un agente a ser Builder",
    paragraphs: [
      "Si construiste tu agente, ya sabes lo que se siente: la IA deja de ser un chat y se vuelve algo que tú diriges.",
      "Ese es el primer escalón. El método completo es Builder Multi-IA.",
      "Ahí construimos, de principio a fin, una app real que coordina las tres IAs con roles: la arquitectura, el stack que uso en mis propios productos, el deploy, y la capa que la vuelve producto —login, accesos, cobro—. No trucos de IA. El oficio completo de construir con ella.",
      "Es para quien ya no quiere mirar cómo se hace, sino hacerlo.",
    ],
    ctaLabel: "Ver Builder Multi-IA — $47 →",
    ctaTarget: "buy",
    closing: ["Nos vemos dentro.", "Rodrigo"],
  },
];

export function getOnboardingEmailCount(): number {
  return EMAILS.length;
}

function ctaPath(target: CtaTarget): string {
  return target === "buy" ? "/app/programas" : "/app";
}

function buildCtaHref(
  baseUrl: string,
  target: CtaTarget,
  emailNumber: number,
): string {
  const params = new URLSearchParams({
    utm_source: "email",
    utm_medium: "sequence",
    utm_campaign: "onboarding",
    utm_content: `email${emailNumber}`,
  });
  return `${baseUrl}${ctaPath(target)}?${params.toString()}`;
}

// Escape mínimo para interpolar texto en el HTML del correo. Importante en el
// nudge: el nombre del usuario (controlado por él) entra en los párrafos.
function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

// Plantilla HTML de marca compartida por el drip de onboarding y el nudge de
// reactivación (mismo look: tarjeta blanca, acento teal, pie con baja).
export function renderBrandedEmail(params: {
  paragraphs: string[];
  ctaLabel: string;
  ctaHref: string;
  closing: string[];
  unsubscribeHref: string;
}): string {
  const body = params.paragraphs
    .map(
      (p) =>
        `<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#1c1917;">${escapeHtml(p)}</p>`,
    )
    .join("");

  const closing = params.closing
    .map(
      (line) =>
        `<p style="margin:0 0 4px;font-size:16px;line-height:1.6;color:#1c1917;">${escapeHtml(line)}</p>`,
    )
    .join("");

  return `<!doctype html>
<html lang="es">
  <body style="margin:0;padding:0;background:#f5f5f4;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(params.ctaLabel)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f4;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e7e5e4;">
            <tr>
              <td style="padding:24px 32px 8px;">
                <p style="margin:0;font-size:13px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#0d9488;">Builder HeredIA</p>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 32px 24px;">
                ${body}
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 24px;">
                  <tr>
                    <td style="border-radius:10px;background:#0d9488;">
                      <a href="${params.ctaHref}" style="display:inline-block;padding:14px 28px;font-size:16px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:10px;">${escapeHtml(params.ctaLabel)}</a>
                    </td>
                  </tr>
                </table>
                ${closing}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px 28px;border-top:1px solid #e7e5e4;">
                <p style="margin:0;font-size:12px;line-height:1.6;color:#78716c;">
                  Recibes este correo porque te registraste en Builder HeredIA.
                  <a href="${params.unsubscribeHref}" style="color:#78716c;text-decoration:underline;">Darme de baja</a>.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

// Renderiza el correo del step dado (0..4). Lanza si el step no existe.
export function renderOnboardingEmail(
  stepIndex: number,
  opts: { baseUrl: string; unsubscribeToken: string },
): { subject: string; html: string } {
  const email = EMAILS[stepIndex];
  if (!email) {
    throw new Error(`No existe correo de onboarding para el step ${stepIndex}.`);
  }

  const emailNumber = stepIndex + 1;
  const unsubscribeHref = `${opts.baseUrl}/unsubscribe?token=${encodeURIComponent(
    opts.unsubscribeToken,
  )}`;

  return {
    subject: email.subject,
    html: renderBrandedEmail({
      paragraphs: email.paragraphs,
      ctaLabel: email.ctaLabel,
      ctaHref: buildCtaHref(opts.baseUrl, email.ctaTarget, emailNumber),
      closing: email.closing,
      unsubscribeHref,
    }),
  };
}
