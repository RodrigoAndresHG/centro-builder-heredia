// Configuración de envío de la secuencia de onboarding. Sin dependencias
// pesadas para poder importarse desde helpers, el cron y las plantillas.

const DEFAULT_BASE_URL = "https://builder.rodriheredia.com";

// URL base absoluta del LMS (para links en emails). Reusa AUTH_URL (la misma
// que usa Stripe Checkout); cae a la de producción si no está.
export function getAppBaseUrl(): string {
  const fromEnv = process.env.AUTH_URL?.trim();
  return (fromEnv && fromEnv.length > 0 ? fromEnv : DEFAULT_BASE_URL).replace(
    /\/$/,
    "",
  );
}

export function getEmailFrom(): string | null {
  const from = process.env.EMAIL_FROM?.trim();
  return from && from.length > 0 ? from : null;
}

// El envío requiere API key de Resend + remitente verificado.
export function isEmailSequenceConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim() && getEmailFrom());
}
