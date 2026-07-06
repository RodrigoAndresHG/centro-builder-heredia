# Arquitectura General

Builder HeredIA usa una arquitectura monolítica modular sobre Next.js App Router. No hay microservicios. La separación se hace por rutas, componentes, servicios y acciones server-side.

## Capas principales

```text
src/app
  Rutas, layouts, route handlers y server components.

src/components
  UI compartida, pública, privada y admin.

src/lib/actions
  Server actions para mutaciones admin, progreso, perfil y atribución.

src/lib/services
  Lectura de datos y lógica de dominio.

src/lib/auth
  Configuración Auth.js / NextAuth.

src/lib/db
  Cliente Prisma.

src/lib/stripe
  Cliente Stripe server-side.

prisma
  Schema, migraciones y seed.
```

## App Router

El proyecto usa route groups:

```text
src/app/(public)
src/app/(user)/app
src/app/(admin)/admin
src/app/api
```

Esto permite mantener rutas públicas, privadas y admin dentro de la misma app sin cambiar la URL final.

## Protección de rutas

La protección vive en:

```text
src/proxy.ts
```

Reglas:

- `/app/*` requiere sesión.
- `/admin/*` requiere sesión y rol admin.
- Usuario autenticado sin admin que intenta entrar a `/admin` se redirige a `/app`.

Next.js 16 requiere `src/proxy.ts` (reemplazo del anterior `middleware.ts` de Next 15 y previos).

## Server components y server actions

La mayoría de páginas privadas/admin son server components. Las mutaciones usan server actions:

- `src/lib/actions/admin-content.ts`
- `src/lib/actions/admin-access.ts`
- `src/lib/actions/progress.ts`
- `src/lib/actions/profile.ts`
- `src/lib/actions/attribution.ts`: `persistAttribution()`, persiste UTMs de la cookie `bh_attribution` al usuario después del login.

Route handlers se usan cuando la integración necesita endpoint HTTP:

- Auth.js.
- Stripe checkout/webhook.
- Early Access.
- Cloudflare Stream direct upload.
- Asistente IA (`/api/asistente`).
- Cron del drip de correos (`/api/cron/email-sequence`).
- Registro externo desde PronostiGol (`/api/external/registro`).
- Desuscripción one-click (`/api/unsubscribe`).

## Servicios de dominio

Servicios importantes:

- `learning.ts`: programas visibles, programa por slug, módulo, lección.
- `access-control.ts`: permisos comerciales.
- `commerce.ts`: checkout, compra, activación de acceso.
- `cloudflare-stream.ts`: Cloudflare API y metadata.
- `builder-updates.ts`: novedades admin/publicadas.
- `progress.ts`: avance por lección.
- `assistant.ts`: Asistente IA (Claude Haiku vía `@anthropic-ai/sdk`, límite 20 mensajes/día por usuario en `AssistantUsage`).
- `email-sequence.ts`: drip de onboarding (5 correos en 7 días, modelo `EmailSequenceState`).
- `prompt-assets.ts`: Biblioteca de Prompts (`PromptAsset`, premium/public; el cuerpo premium se vacía server-side sin acceso).
- `external-registro.ts`: integración con PronostiGol (validación, throttle y magic link).
- `admin-content.ts`: lecturas admin de contenido.
- `admin-access.ts`: lecturas admin de accesos.

## Prisma

El Prisma Client se genera en:

```text
src/generated/prisma
```

El cliente app se inicializa en:

```text
src/lib/db/prisma.ts
```

Usa `@prisma/adapter-pg` y `DATABASE_URL`.

Nota: `prisma.config.ts` usa `DATABASE_URL_UNPOOLED` para CLI y migraciones. Es requerido en entornos con PgBouncer (Neon/Vercel), porque el pooler rompe el advisory lock de `prisma migrate`. El build de Vercel corre `prisma migrate deploy && next build`.

Modelos agregados después del esquema base: `Product`, `PromptAsset`, `LessonPrompt`, `LessonResource`, `AssistantUsage`, `EmailSequenceState`, `ExternalSignupThrottle` y `LinkClickEvent`, además de campos de atribución en `User` (`utmSource`, `utmMedium`, `utmCampaign`, `signupIntent`, `signupSource`).

## Integraciones externas

### Auth

Auth.js con Prisma Adapter y sesiones persistidas en DB. Login con Google y por enlace mágico (Nodemailer/Resend SMTP; se activa con `EMAIL_SERVER` + `EMAIL_FROM`). El callback de redirect mantiene una allowlist para poder volver a PronostiGol tras el magic link.

### Stripe

Checkout se crea desde `/api/stripe/checkout`. Webhook procesa confirmación y activa acceso. El `stripePriceId` se administra por producto desde `/admin/productos`.

### Cloudflare Stream

Admin solicita URL de direct upload. El archivo sube directo a Cloudflare. La DB guarda metadata y `streamVideoId`, no binarios. Además del direct upload existe subida TUS reanudable (`tus-js-client`, chunks de 50MB, archivos hasta ~30GB) y asociación manual de video por UID.

### Resend

Envía el drip de onboarding (5 correos en 7 días) con `idempotencyKey` y header `List-Unsubscribe`. También puede servir como SMTP del magic link. Env: `RESEND_API_KEY`.

### Anthropic

`@anthropic-ai/sdk` alimenta el Asistente IA Builder (Claude Haiku). Envs: `ANTHROPIC_API_KEY` y `ASSISTANT_MODEL`. El límite de 20 mensajes/día por usuario se lleva en la tabla `assistant_usage`.

### Vercel Cron

`vercel.json` define un cron diario (14:00 UTC) que llama `GET /api/cron/email-sequence` autenticado con `CRON_SECRET` para avanzar el drip de correos.

## Atribución de marketing

- `/bio?src=X` construye links salientes con UTMs; `/go/whatsapp?src=` registra el clic en `link_click_events` y hace 302 al canal.
- `/registro` monta `AttributionCapture`, que guarda la cookie `bh_attribution` (SameSite=Lax).
- La persistencia confiable ocurre después del login: `AttributionSync` en el layout de `/app` dispara el Server Action `persistAttribution()` (`src/lib/actions/attribution.ts`). No se hace en `events.createUser` de Auth.js v5 porque `cookies()` no funciona confiablemente en ese contexto.

## API externa y rate limiting

`POST /api/external/registro` valida `X-API-Key` contra `EXTERNAL_API_KEY` con comparación timing-safe, aplica rate limit de 5/min por IP usando la tabla `external_signup_throttle` y habilita CORS para `https://pronostigol.rodriheredia.com`. Config en `src/lib/external/config.ts` (`PRONOSTIGOL_APP_URL` opcional).

## Patrón de autorización

Hay dos capas:

1. Protección superficial por `proxy.ts`.
2. Validación server-side por servicios antes de mostrar programa, módulo o lección.

No basta con ocultar links en UI. Las páginas de aprendizaje llaman servicios que validan acceso.

## Convenciones actuales

- Programas visibles para usuario: `Program.status` en `PRESALE` u `OPEN`.
- Contenido consumible normal: programa `OPEN`.
- En preventa: mapa visible, consumo limitado salvo preview.
- Módulos y lecciones de usuario se filtran por `isPublished`.
- Admin puede ver y operar contenido independientemente de reglas comerciales.

