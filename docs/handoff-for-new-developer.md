# Handoff Para Nuevo Developer

Este documento es la entrada práctica para retomar Builder HeredIA.

## 1. Qué estás tomando

Estás tomando una app Next.js que ya opera:

- Landing pública (reorientada post-lanzamiento al Agente de Noticias USD 9.99).
- Login/registro (Google OAuth + magic link con Nodemailer/Resend SMTP; `/acceso-confirmado`).
- Workspace privado.
- Admin (incluye `/admin/productos`, `/admin/biblioteca`, `/admin/early-access`).
- Stripe checkout/webhook.
- Activación de acceso.
- CRUD de programas/módulos/lecciones (filtros por programa, borrados con confirmación tipeada).
- Cloudflare Stream para video (direct upload + TUS reanudable hasta ~30GB).
- Novedades Builder.
- Preventa por programa.
- Prompts y recursos por lección (`LessonPrompt`, `LessonResource`).
- Biblioteca de Prompts (`/app/biblioteca`, modelo `PromptAsset`, premium vaciado server-side).
- Asistente IA "Asistente Builder" (widget en `/app`, Claude Haiku, límite 20/día).
- Embudo `/bio` + atribución de marketing (UTMs, cookie `bh_attribution`, `link_click_events`, `/go/whatsapp`).
- API externa `POST /api/external/registro` (integración PronostiGol).
- Drip de onboarding: 5 emails en 7 días vía Resend + cron diario.

No es solo bootstrap.

## 2. Setup local

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Para DB remota/producción:

```bash
npm run prisma:deploy
```

Verificación:

```bash
npm run lint
npm run build
npm run test
```

La suite tiene 66 tests con Vitest (validators, atribución, email-sequence, commerce, access-control).

Notas de infra:

- `prisma.config.ts` usa `DATABASE_URL_UNPOOLED` para CLI/migraciones (fix de advisory locks con PgBouncer).
- En Vercel el build es `vercel-build`: `prisma migrate deploy && next build`.
- `.npmrc` fija `legacy-peer-deps`.

## 3. Variables mínimas para trabajar

Para navegación básica:

- `DATABASE_URL`
- `DATABASE_URL_UNPOOLED` (migraciones/CLI)
- `AUTH_SECRET`
- `AUTH_URL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

Para magic link:

- `EMAIL_SERVER`
- `EMAIL_FROM`

Para compra:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

Para video:

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_STREAM_TOKEN`
- `CLOUDFLARE_STREAM_REQUIRE_SIGNED_URLS=false`

Para asistente IA:

- `ANTHROPIC_API_KEY` (`ASSISTANT_MODEL` opcional)

Para API externa:

- `EXTERNAL_API_KEY` (`PRONOSTIGOL_APP_URL` opcional)

Para drip de onboarding:

- `RESEND_API_KEY`
- `CRON_SECRET`

## 4. Primeros archivos a leer

```text
src/lib/auth/index.ts
src/proxy.ts
src/lib/services/access-control.ts
src/lib/services/learning.ts
src/lib/services/commerce.ts
src/lib/actions/admin-content.ts
src/lib/actions/admin-access.ts
src/lib/services/cloudflare-stream.ts
src/lib/services/assistant.ts
src/lib/services/prompt-assets.ts
src/lib/services/external-registro.ts
src/lib/services/email-sequence.ts
src/lib/actions/attribution.ts
src/app/bio/bio-config.ts
prisma/schema.prisma
```

## 5. Flujos que no debes romper

### Auth

- Google login.
- Sesiones DB.
- Protección `/app` y `/admin`.

### Stripe

- Checkout autenticado.
- Webhook firmado.
- `Purchase` upsert por `stripeCheckoutSessionId`.
- `Access.source = STRIPE`.

### Acceso premium

- Permiso real por `Access`.
- Admin bypass comercial.
- Usuario sin acceso no debe abrir rutas premium directas.

### Contenido

- Programa -> Módulo -> Lección -> Video.
- Video se gestiona desde lección.
- `/admin/videos` es biblioteca.

### Preventa

- `PRESALE` visible/comprable.
- `OPEN` consumible.
- `DRAFT` oculto.

### Atribución

- `/bio?src=X` -> links con UTMs -> `/registro` guarda cookie `bh_attribution`.
- La persistencia real ocurre en `persistAttribution()` (Server Action) al entrar a `/app`. NO mover esa lógica a `events.createUser`: `cookies()` no es confiable ahí.
- `/go/whatsapp?src=` debe seguir registrando el clic en `link_click_events` antes del 302.

### API externa

- `X-API-Key` timing-safe, rate limit 5/min por IP en DB, CORS para PronostiGol.
- El redirect del magic link se valida contra allowlist en el callback de Auth.js.

### Drip de onboarding

- Inscripción idempotente en `events.createUser`.
- El cron `/api/cron/email-sequence` exige `CRON_SECRET`.
- Respetar `unsubscribed`: no reenviar tras baja (RFC 8058 one-click).

## 6. Cómo probar rápido

### Usuario invitado

1. Login con Google.
2. Ir a `/app`.
3. Ver showroom sin acceso.
4. Ir a `/app/programas`.
5. Confirmar que no consume premium sin acceso.

### Usuario con acceso

1. Crear acceso por Stripe o admin TEST.
2. Entrar a `/app`.
3. Ver continuidad.
4. Abrir programa/módulo/lección.
5. Marcar lección completada.

### Admin

1. Entrar con `SEED_ADMIN_EMAIL`.
2. Crear/editar programa.
3. Crear módulo.
4. Crear lección.
5. Subir video desde lección.
6. Crear novedad.
7. Ver accesos.

### Stripe

1. Iniciar checkout desde usuario autenticado.
2. Completar pago.
3. Confirmar webhook.
4. Ver `Purchase`.
5. Ver `Access`.
6. Ver `/app` con acceso.

## 7. Preguntas críticas respondidas

### Cloudflare Stream signed URLs

No están activas hoy.

```text
CLOUDFLARE_STREAM_REQUIRE_SIGNED_URLS=false
```

Playback actual por iframe público. Signed URLs quedan para hardening futuro.

### Auth database sessions

`session.strategy: "database"` es intencional. No migrar a JWT por ahora.

### Stripe event.id

No hay dedupe por `event.id` todavía. Idempotencia actual por `stripeCheckoutSessionId`.

### ¿Por qué la atribución no se guarda en `events.createUser`?

Porque `cookies()` no funciona de forma confiable dentro de los eventos de Auth.js v5. La persistencia confiable es el Server Action `persistAttribution()` disparado por `AttributionSync` en el layout de `/app`. Ver `decisions-and-tradeoffs.md`.

### ¿Borrar un usuario borra sus compras?

Sí, a propósito (cascade), con confirmación tipeada del email. Los admins no se pueden borrar. En cambio, borrar un programa preserva `Purchase`.

## 8. Antes de cambiar algo importante

Lee:

- `decisions-and-tradeoffs.md`
- `known-issues-and-next-steps.md`

Y valida:

```bash
npm run lint
npm run build
npm run test
```

## 9. Mental model rápido

```text
User tiene roleKey + campos de atribución (utm*, signupSource, signupIntent).
Access define permiso real.
Product se vende con Stripe (Price ID gestionado en /admin/productos).
Program puede estar DRAFT/PRESALE/OPEN y tiene sortOrder.
Module organiza lecciones.
Lesson contiene contenido, video, preview, prompts y recursos.
LessonProgress guarda avance.
BuilderUpdate alimenta Novedades.
PromptAsset alimenta la Biblioteca (premium se desbloquea con programa pago).
AssistantUsage limita el asistente IA (20/día).
LinkClickEvent registra clics medibles (/bio, /go/whatsapp).
EmailSequenceState controla el drip de onboarding.
ExternalSignupThrottle limita la API externa por IP.
```

