// Configuración de las apps externas del ecosistema rodriheredia que se
// integran con el LMS (ej. PronostiGol). Sin dependencias para poder
// importarse tanto desde la config de Auth.js como desde las API routes.

// Base de la app de predicciones del Mundial. Se puede sobreescribir por
// entorno (útil para staging); por defecto apunta a producción.
export const PRONOSTIGOL_BASE_URL =
  process.env.PRONOSTIGOL_APP_URL?.trim() || "https://pronostigol.rodriheredia.com";

// Origen (esquema + host) usado para la allowlist de redirects de Auth.js
// y para la cabecera CORS del endpoint externo.
export const PRONOSTIGOL_ORIGIN = new URL(PRONOSTIGOL_BASE_URL).origin;

// Orígenes externos a los que Auth.js puede redirigir tras el magic link.
// Cualquier otro destino externo se ignora y cae al propio LMS (seguro
// por defecto, igual que el comportamiento estándar de Auth.js).
export const TRUSTED_EXTERNAL_ORIGINS = new Set<string>([PRONOSTIGOL_ORIGIN]);
