# Auth Y Sesiones

La autenticación vive en:

```text
src/lib/auth/index.ts
src/app/api/auth/[...nextauth]/route.ts
src/proxy.ts
src/types/next-auth.d.ts
src/lib/external/config.ts
```

## Auth.js / NextAuth

El proyecto usa NextAuth v5 beta con Prisma Adapter.

Providers actuales:

- Google.
- Nodemailer, solo si `EMAIL_SERVER` y `EMAIL_FROM` están configurados.

Páginas custom:

- `signIn`: `/login`
- `verifyRequest`: `/acceso-confirmado`

## Sesiones en base de datos

Decisión explícita:

```ts
session: {
  strategy: "database",
}
```

Esto queda documentado como decisión consciente desde ahora.

Motivos:

- Control operativo de sesiones.
- Posible revocación futura.
- Gobernanza de sesiones si el LMS crece.
- Coherencia con Prisma Adapter y modelos Auth.js.

No migrar a JWT por ahora.

## Callback de sesión

El callback añade:

- `session.user.id`
- `session.user.role`

El rol viene de `user.roleKey`.

## Callback de redirect

El callback `redirect` replica el comportamiento por defecto de Auth.js (URLs relativas y del mismo origen permitidas; todo lo demás cae al LMS) y agrega una allowlist de orígenes externos de confianza:

- `TRUSTED_EXTERNAL_ORIGINS` vive en `src/lib/external/config.ts`.
- Hoy contiene solo el origen de PronostiGol (`PRONOSTIGOL_APP_URL`, por defecto `https://pronostigol.rodriheredia.com`).
- Sirve para que el magic link disparado desde `/api/external/registro` pueda volver a la app externa tras verificarse.

Cualquier destino externo fuera de la allowlist se ignora y se redirige al propio LMS.

## Evento createUser

`events.createUser` hace dos cosas, cada una en su propio `try/catch` para no bloquear el registro:

1. **Inscripción al drip de onboarding**: `enrollUserInOnboarding(user.id, user.email)` crea (upsert idempotente) el registro `EmailSequenceState` del usuario. Solo necesita el objeto `User`, no cookies, así que aquí sí es confiable. Ver el flujo 16 en `critical-flows.md`.
2. **Atribución best-effort**: intenta leer la cookie `bh_attribution` con `cookies()` de `next/headers` (import dinámico para no arrastrarlo al bundle del middleware) y escribir los campos UTM del usuario.

Decisión documentada:

> Dentro de `events.createUser` de Auth.js v5, `cookies()` NO es 100% confiable: puede no tener el contexto de request tras el round-trip de OAuth y fallar silenciosamente. Por eso el intento en `createUser` es solo best-effort y la fuente de verdad es el Server Action `persistAttribution()`, que corre desde `/app` tras el login (una petición del mismo origen, donde `cookies()` siempre tiene contexto).

## Atribución de marketing

Archivos:

```text
src/lib/attribution.ts
src/lib/actions/attribution.ts
src/components/public/attribution-capture.tsx
src/components/app/attribution-sync.tsx
```

Flujo:

1. `/bio?src=X` construye los links a `/registro` con `utm_source`/`utm_medium`/`utm_campaign` e `intent` (`explore` o `buy`).
2. `/registro` monta `AttributionCapture`, que guarda los UTMs en la cookie first-party `bh_attribution` (`SameSite=Lax`, `max-age` 1 hora) para que sobreviva el redirect de Google y el clic del magic link.
3. Tras el login, el layout de `/app` monta `AttributionSync`, que dispara el Server Action `persistAttribution()`.
4. `persistAttribution()` escribe `User.utmSource/utmMedium/utmCampaign/signupIntent` con semántica de **primer toque** (si el usuario ya tiene fuente, no se reescribe) y borra la cookie (un solo uso).

## Login por enlace mágico

Provider Nodemailer (SMTP, p. ej. el SMTP de Resend). Solo se registra si existen `EMAIL_SERVER` y `EMAIL_FROM`.

Flujo:

1. Usuario escribe su email en `/login` o `/registro`.
2. Auth.js crea un `VerificationToken` y envía el enlace por SMTP.
3. Se muestra la página custom `/acceso-confirmado` (`verifyRequest`).
4. Al hacer clic en el enlace, Auth.js verifica el token, crea/actualiza `User` y crea la `Session` en DB.
5. El redirect final respeta el callback `redirect` (incluida la allowlist externa).

## API externa de registro

`POST /api/external/registro` permite que apps de confianza (hoy PronostiGol) registren usuarios por email:

- Autenticación por header `X-API-Key` comparada en tiempo constante contra `EXTERNAL_API_KEY`.
- Rate limit de 5 solicitudes por minuto por IP (tabla `external_signup_throttle`).
- CORS restringido al origen de PronostiGol.
- Dispara un magic link cuyo `redirectTo` apunta de vuelta a PronostiGol; el callback `redirect` lo permite gracias a `TRUSTED_EXTERNAL_ORIGINS`.

Detalle completo en el flujo 15 de `critical-flows.md`.

## Roles

Roles base:

- `INVITADO`
- `USUARIO_PAGO`
- `ADMIN`

Un usuario nuevo entra como `INVITADO`.

Cuando Stripe activa acceso, si el usuario no es admin, se promueve a `USUARIO_PAGO`.

Importante:

- Rol describe capacidad general de usuario.
- `Access.source` describe origen del acceso.
- No mezclar ambas cosas.

## Protección por proxy

Archivo:

```text
src/proxy.ts
```

Reglas:

- `/app/*`: requiere sesión.
- `/admin/*`: requiere sesión y rol admin.

Si no hay sesión, se redirige a `/login?callbackUrl=...`.

Si hay sesión pero no admin en `/admin`, se redirige a `/app`.

## Google OAuth

Callback local:

```text
http://localhost:3000/api/auth/callback/google
```

En producción debe apuntar al dominio real:

```text
https://builder.rodriheredia.com/api/auth/callback/google
```

## Email provider

El correo es opcional. Si faltan `EMAIL_SERVER` o `EMAIL_FROM`, el provider de Nodemailer no se registra.

No mostrar errores técnicos al usuario final si email no está listo.

## Recomendaciones de mantenimiento

- No cambiar `session.strategy` a JWT sin revisar impacto en `proxy.ts`, callbacks, revocación y admin.
- Mantener `AUTH_SECRET` fuerte.
- Asegurar `AUTH_URL` correcto en producción.
- Revisar expiración/limpieza de sesiones si el sistema crece.

