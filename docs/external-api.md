# API externa: registro desde PronostiGol

`POST /api/external/registro` permite que apps externas del ecosistema (hoy: PronostiGol, la app del Mundial 2026 en `pronostigol.rodriheredia.com`) den de alta usuarios en el LMS por email y les disparen un magic link que los devuelve a la app externa ya autenticados.

Estado: **Parte A implementada** (alta + magic link con redirect de vuelta). **Parte B pendiente**: sesión cross-dominio real — hoy la sesión de Auth.js vive en cookies de `builder.rodriheredia.com`, así que PronostiGol no la ve; falta el mecanismo para que la app externa consuma esa identidad.

## Contrato

```text
POST /api/external/registro
Headers: Content-Type: application/json, X-API-Key: <EXTERNAL_API_KEY>
Body:    { "email": "...", "signupSource": "pronostigol", "partidoId": "opcional" }
→ 200 { "ok": true, "isNew": true|false }
```

Validación en `src/lib/validators/external.ts` (`externalRegistroSchema`): email normalizado (trim + lowercase, máx 200), `signupSource` obligatorio (máx 60), `partidoId` opcional (máx 60). Errores: 400 datos inválidos, 401 API key mala, 429 rate limit, 503 endpoint o email sin configurar, 500 inesperado.

Ruta: `src/app/api/external/registro/route.ts`. `runtime = "nodejs"` obligatorio (usa `node:crypto`, Prisma con adaptador pg y Nodemailer — no corre en Edge).

## Autenticación: X-API-Key

- Header `X-API-Key` comparado contra la env `EXTERNAL_API_KEY` con `timingSafeEqual` (comparación en tiempo constante para no filtrar la key por timing; primero compara longitudes).
- Sin `EXTERNAL_API_KEY` configurada → 503 y log (el endpoint queda apagado, no abierto).
- También exige `EMAIL_SERVER` + `EMAIL_FROM` (el flujo termina en un magic link); si faltan → 503.

## Rate limit por IP

`consumeExternalSignupRateLimit(ip)` en `src/lib/services/external-registro.ts`:

- **5 peticiones por IP y por minuto** (`EXTERNAL_SIGNUP_RATE_LIMIT = 5`), para evitar abuso del envío de correos.
- Serverless-safe: el contador vive en la tabla `external_signup_throttle` (modelo `ExternalSignupThrottle`), con `bucket = "<ip>:<minuto-ISO>"` y `upsert` + `increment`. Las filas viejas se pueden purgar luego (índice por `createdAt`).
- La IP sale de `x-forwarded-for` (primer valor) o `x-real-ip`.

## Alta de usuario

`registerExternalUser({ email, signupSource })`:

- Crea el usuario con `roleKey: "INVITADO"` y el `signupSource` recibido. Nunca duplica: si el correo ya existe, lo deja intacto y devuelve `isNew: false`.
- Maneja la carrera find→create capturando el error Prisma `P2002` (unique violation) como `isNew: false`.

## CORS

Headers fijos en la ruta: `Access-Control-Allow-Origin: PRONOSTIGOL_ORIGIN`, métodos `POST, OPTIONS`, headers `Content-Type, X-API-Key`, `Max-Age: 86400`, `Vary: Origin`. Handler `OPTIONS` → 204. Solo el origen de PronostiGol puede llamar desde navegador.

## Magic link con redirect allowlisted

Tras el alta, el endpoint dispara `signIn("nodemailer", { email, redirectTo, redirect: false })` con `redirectTo` apuntando a PronostiGol (con `partidoId` como query param si vino).

Para que Auth.js acepte ese destino externo, el callback `redirect` en `src/lib/auth/index.ts` replica el comportamiento por defecto (relativas y mismo origen permitidas; todo lo demás cae al LMS) **más** una allowlist: `TRUSTED_EXTERNAL_ORIGINS` de `src/lib/external/config.ts`, que hoy contiene solo `PRONOSTIGOL_ORIGIN`. Cualquier otro destino externo se ignora — seguro por defecto.

## Configuración

`src/lib/external/config.ts` (sin dependencias, importable desde la config de Auth.js y desde API routes):

- `PRONOSTIGOL_BASE_URL`: env `PRONOSTIGOL_APP_URL` (opcional, útil para staging) o `https://pronostigol.rodriheredia.com`.
- `PRONOSTIGOL_ORIGIN`: derivado de la base; se usa para CORS y allowlist.
- `TRUSTED_EXTERNAL_ORIGINS`: set de orígenes externos confiables para el redirect de Auth.js.

## Variables de entorno

| Env | Rol |
| --- | --- |
| `EXTERNAL_API_KEY` | Secreto compartido con PronostiGol; sin ella el endpoint responde 503. |
| `EMAIL_SERVER`, `EMAIL_FROM` | Requeridas para el magic link (proveedor Nodemailer). |
| `PRONOSTIGOL_APP_URL` | Opcional; sobreescribe la base de PronostiGol (staging). |

## Pendiente: Parte B (sesión cross-dominio)

El magic link deja al usuario con sesión válida en el LMS y lo redirige a PronostiGol, pero PronostiGol no puede leer esa sesión (dominios distintos). Falta definir e implementar el puente (p. ej. token firmado de corta vida en el redirect, o un endpoint de verificación servidor-a-servidor). Hasta entonces, PronostiGol solo sabe que el registro se disparó (`ok: true`).

## Archivos clave

```text
src/app/api/external/registro/route.ts   → endpoint (auth, rate limit, CORS, magic link)
src/lib/services/external-registro.ts    → alta idempotente + throttle en DB
src/lib/validators/external.ts           → schema del body (+ .test.ts)
src/lib/external/config.ts               → base URL, origen y allowlist
src/lib/auth/index.ts                    → callback redirect con TRUSTED_EXTERNAL_ORIGINS
prisma/schema.prisma                     → modelo ExternalSignupThrottle
```

## Reglas de trabajo

- No relajar la allowlist de redirects: agregar orígenes solo vía `TRUSTED_EXTERNAL_ORIGINS`.
- No cambiar la comparación de la API key por un `===` (perdería la resistencia a timing).
- El rate limit debe seguir viviendo en la DB: memoria de proceso no sirve en serverless.
