# Variables De Entorno

Archivo base:

```text
.env.example
```

## Base de datos

```text
DATABASE_URL
DATABASE_URL_UNPOOLED
```

PostgreSQL. En producción apunta a Neon.

`DATABASE_URL_UNPOOLED` es la conexión directa (sin PgBouncer) de Neon y la usa
solo el CLI de Prisma (`prisma migrate deploy`, `db push`, etc.) vía
`prisma.config.ts`, para evitar la contención de advisory locks que causa el
pooling por transacción. Si no está definida, el CLI cae a `DATABASE_URL`
(caso típico en local). El runtime (`PrismaClient`) siempre usa `DATABASE_URL`.

## Auth

```text
AUTH_SECRET
AUTH_URL
```

`AUTH_URL` debe ser:

- Local: `http://localhost:3000`
- Producción: dominio real de Builder.

## Google OAuth

```text
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
```

Callback:

```text
/api/auth/callback/google
```

## Email magic-link (opcional)

```text
EMAIL_SERVER
EMAIL_FROM
```

Si faltan, el provider Nodemailer no se registra.

Si AMBAS están definidas, `/login` muestra automáticamente el formulario
"Acceso por correo" (login por enlace mágico, ver `src/lib/auth/index.ts`).
Proveedor recomendado: Resend vía SMTP, con `EMAIL_FROM` en un dominio
verificado (SPF/DKIM).

## Email drip / onboarding

```text
RESEND_API_KEY
CRON_SECRET
```

Secuencia de onboarding: 5 correos en 7 días (día 0/1/3/5/7), enviados con la
API de Resend por el cron `GET /api/cron/email-sequence`.

- `RESEND_API_KEY`: API key de Resend. Sin ella el cron responde 500 y no envía.
- `CRON_SECRET`: Vercel Cron autentica con `Authorization: Bearer ${CRON_SECRET}`.
  Genéralo con `openssl rand -hex 32`.

`vercel.json` programa el cron diario a las 14:00 UTC (`"0 14 * * *"`). Cada
paso reintenta hasta 3 veces antes de marcarse `failed`
(ver `EmailSequenceState.attempts` en `prisma/schema.prisma`).

## Asistente IA

```text
ANTHROPIC_API_KEY
ASSISTANT_MODEL
```

Widget de chat "Asistente Builder" en `/app` (`POST /api/asistente`).

- `ANTHROPIC_API_KEY`: sin la key, el widget se muestra pero responde que el
  asistente no está disponible.
- `ASSISTANT_MODEL`: opcional, override del modelo (default `claude-haiku-4-5`).

Límite de 20 mensajes/día por usuario (tabla `assistant_usage`).

## Integraciones externas

```text
EXTERNAL_API_KEY
PRONOSTIGOL_APP_URL
```

Para `POST /api/external/registro` (registro por email desde PronostiGol).

- `EXTERNAL_API_KEY`: clave secreta que la app externa envía en el header
  `X-API-Key` (comparación timing-safe). Sin ella el endpoint responde 503.
  Solo de servidor a servidor. Rate limit de 5/min por IP vía la tabla
  `external_signup_throttle`.
- `PRONOSTIGOL_APP_URL`: opcional, URL base a la que vuelve el magic link
  (allowlist de redirect en el callback de Auth.js). Default
  `https://pronostigol.rodriheredia.com` (ver `src/lib/external/config.ts`).

## Analytics y comunidad

```text
NEXT_PUBLIC_CLARITY_PROJECT_ID
NEXT_PUBLIC_COMMUNITY_URL
```

- `NEXT_PUBLIC_CLARITY_PROJECT_ID`: Microsoft Clarity. Opcional — dejar vacío
  en local para no contaminar el dashboard.
- `NEXT_PUBLIC_COMMUNITY_URL`: link de la comunidad de WhatsApp mostrado en el
  LMS. Opcional — hay un default en `src/lib/community.ts`.

## Apple placeholder

```text
APPLE_CLIENT_ID
APPLE_CLIENT_SECRET
```

Actualmente preparado como placeholder, no como flujo activo principal.

## Stripe

```text
STRIPE_SECRET_KEY
STRIPE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_IDEACASH_PRICE_ID
```

`STRIPE_IDEACASH_PRICE_ID` es opcional/heredada del MVP: sirve para el
seed/bootstrap del producto inicial. Cada Producto creado en Admin Productos
tiene su propio `stripePriceId` en DB, que es la fuente operativa real.

Opcionales usados por código para branding visual de Checkout:

```text
STRIPE_CHECKOUT_LOGO_FILE_ID
STRIPE_CHECKOUT_ICON_FILE_ID
```

Si no existen, Checkout mantiene display name pero no logo/icon custom.

## Cloudflare Stream

```text
CLOUDFLARE_ACCOUNT_ID
CLOUDFLARE_STREAM_TOKEN
CLOUDFLARE_STREAM_REQUIRE_SIGNED_URLS
```

Estado recomendado actual:

```text
CLOUDFLARE_STREAM_REQUIRE_SIGNED_URLS=false
```

No activar en true hasta implementar signed playback.

## Seed

```text
SEED_ADMIN_EMAIL
SEED_ACCESS_EMAIL
```

`SEED_ADMIN_EMAIL` crea/promueve admin.

`SEED_ACCESS_EMAIL` crea usuario de prueba con acceso.

## Notas de build y despliegue

- `package.json` define `vercel-build = "prisma migrate deploy && next build"`:
  Vercel aplica migraciones antes de compilar en cada deploy.
- `.npmrc` fija `legacy-peer-deps=true` para que el install no falle por
  conflictos de peer dependencies.
- En Vercel, además de las vars de app, configurar `DATABASE_URL_UNPOOLED`
  (migraciones), `CRON_SECRET` y `RESEND_API_KEY` (drip) si aplican.

## Checklist para nueva máquina

1. Copiar `.env.example` a `.env`.
2. Configurar `DATABASE_URL`.
3. Configurar Auth.
4. Configurar Google.
5. Configurar Stripe si se probará compra.
6. Configurar Cloudflare si se probará video.
7. Configurar `EMAIL_SERVER`/`EMAIL_FROM` si se probará magic link,
   y `ANTHROPIC_API_KEY` si se probará el asistente IA.
8. Ejecutar migraciones.
9. Ejecutar seed.

## Cuidado con secretos

Nunca commitear `.env`.

Si se rota un secreto:

- Actualizar Vercel.
- Actualizar entorno local.
- Validar flujo afectado.

