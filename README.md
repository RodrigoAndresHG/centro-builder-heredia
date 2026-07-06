## Centro Builder HeredIA

LMS del Centro Builder HeredIA. Una sola app Next.js con rutas publicas, portal de usuario, panel admin, API routes, Prisma/PostgreSQL y despliegue en Vercel. Ya no es solo bootstrap: opera venta con Stripe, video con Cloudflare Stream, asistente IA, biblioteca de prompts, embudo /bio con atribucion de marketing, drip de onboarding por email y API externa de registro.

## Stack

- Next.js con App Router
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL
- Vercel (Analytics + cron)
- Auth.js / NextAuth (Google OAuth + magic link)
- Stripe Checkout
- Cloudflare Stream (direct upload + TUS)
- Anthropic Claude (asistente IA)
- Resend (emails de onboarding)
- Vitest (tests)
- Microsoft Clarity (analitica de comportamiento)

## Como correrlo

Instala dependencias:

```bash
npm install
```

Copia las variables de entorno:

```bash
cp .env.example .env
```

Actualiza `DATABASE_URL` y el resto de secretos locales. Luego genera Prisma Client:

```bash
npm run prisma:generate
```

Ejecuta migraciones y seed base:

```bash
npm run prisma:migrate
npm run prisma:seed
```

En produccion/Vercel el build corre `vercel-build`:

```bash
prisma migrate deploy && next build
```

Levanta desarrollo:

```bash
npm run dev
```

Verifica compilacion y tests:

```bash
npm run lint
npm run build
npm run test
```

Los tests (66 con Vitest) cubren validators, atribucion, email-sequence, commerce y access-control.

Notas de infra:

- `prisma.config.ts` usa `DATABASE_URL_UNPOOLED` para CLI/migraciones (evita el problema de advisory locks con PgBouncer).
- `.npmrc` fija `legacy-peer-deps`.
- `vercel.json` define el cron diario del drip de emails (14:00 UTC).

## Estructura general

```text
src/app/(public)              Rutas publicas
src/app/(user)/app            Portal privado de usuario
src/app/(admin)/admin         Panel administrativo
src/app/bio                   Embudo publico /bio (bio-config.ts)
src/app/go                    Redirects medibles (/go/whatsapp)
src/app/unsubscribe           Baja del drip de emails
src/app/api                   Route handlers
src/components/shared         UI reutilizable base
src/components/public         Componentes publicos
src/components/app            Componentes del portal de usuario
src/components/learning       Componentes de aprendizaje
src/components/admin          Componentes admin
src/lib/auth                  Auth.js
src/lib/db                    Prisma y acceso a datos
src/lib/stripe                Cliente Stripe server-side
src/lib/permissions           Helpers de rol
src/lib/services              Servicios de dominio
src/lib/validators            Validadores Zod
src/lib/external              Config de la API externa
src/lib/email                 Emails de onboarding
src/types                     Tipos compartidos
prisma/schema.prisma          Schema Prisma
```

## Rutas

- Publicas: `/`, `/login`, `/registro`, `/acceso-confirmado`, `/bio`, `/go/whatsapp`, `/unsubscribe`. `/programas/build-ideacash` es redirect legacy a `/`.
- Usuario: `/app`, `/app/programas`, `/app/programas/[programSlug]`, `/app/programas/[programSlug]/modulos/[moduleSlug]`, `/app/programas/[programSlug]/lecciones/[lessonSlug]`, `/app/updates`, `/app/updates/[id]`, `/app/perfil`, `/app/soporte`, `/app/biblioteca`
- Admin: `/admin`, `/admin/programas`, `/admin/modulos`, `/admin/lecciones`, `/admin/videos`, `/admin/updates`, `/admin/usuarios`, `/admin/accesos`, `/admin/productos`, `/admin/biblioteca`, `/admin/early-access`
- API: `/api/health`, `/api/stripe/checkout`, `/api/stripe/webhook`, `/api/asistente`, `/api/external/registro`, `/api/cron/email-sequence`, `/api/unsubscribe`, `/api/early-access`, `/api/admin/*`

## Features principales

### Aprendizaje

- Programa -> Modulo -> Leccion -> Video, con progreso por `LessonProgress`.
- `LessonPrompt`: prompts copiables por leccion.
- `LessonResource`: recursos por leccion de tipo `LINK`, `DOWNLOAD` o `REFERENCE`.

### Video (Cloudflare Stream)

- Direct upload clasico y subida reanudable TUS (`tus-js-client`, chunks de 50MB, archivos hasta ~30GB).
- Asociacion manual de video por UID desde admin.

### Asistente IA

- Widget "Asistente Builder" en `/app`, respaldado por `POST /api/asistente`.
- Claude Haiku via `@anthropic-ai/sdk` (`ANTHROPIC_API_KEY`, `ASSISTANT_MODEL` opcional).
- Limite de 20 mensajes por dia por usuario (tabla `assistant_usage`).
- Conocimiento estatico + programas y precios reales de la DB.

### Biblioteca de Prompts

- `/app/biblioteca` (usuario) y `/admin/biblioteca` (CRUD admin).
- Modelo `PromptAsset`: `platform` (CLAUDE/CHATGPT/GEMINI/MULTI), `category`, `isPremium`, `isPublished`.
- El contenido premium se desbloquea con acceso a cualquier programa de pago; sin acceso, el body premium se vacia server-side.

### Embudo /bio y atribucion de marketing

- `/bio` (configurado en `src/app/bio/bio-config.ts`): cursos gratis -> USD 9.99 -> USD 47, tarjeta del Mundial (PronostiGol) con flag `MUNDIAL_ACTIVO`, canal de WhatsApp y banner para abrir en navegador externo.
- `/bio?src=X` construye links con UTMs; `/registro` monta `AttributionCapture` (cookie `bh_attribution`, SameSite=Lax).
- La persistencia confiable la hace el Server Action `persistAttribution()` disparado por `AttributionSync` en el layout de `/app` (post-login).
- Campos `User.utmSource/utmMedium/utmCampaign/signupIntent/signupSource`; clics registrados en `link_click_events`; `/go/whatsapp?src=` responde 302 al canal registrando el clic.
- Resumen por fuente en `/admin/usuarios` (columnas de fecha de registro y Fuente).

### API externa (PronostiGol)

- `POST /api/external/registro`: registro por email desde apps externas.
- Auth por header `X-API-Key` comparado timing-safe contra `EXTERNAL_API_KEY`.
- Rate limit 5/min por IP (tabla `external_signup_throttle`), CORS para `https://pronostigol.rodriheredia.com`.
- Dispara magic link con redirect de vuelta a la app externa (allowlist de redirect en el callback de Auth.js; config en `src/lib/external/config.ts`, `PRONOSTIGOL_APP_URL` opcional).

### Drip de onboarding

- 5 emails en 7 dias (dias 0/1/3/5/7) via Resend, con `idempotencyKey` y header `List-Unsubscribe`.
- Modelo `EmailSequenceState` (step, status pending/done/unsubscribed/failed, hasta 3 intentos, `unsubscribeToken`).
- Inscripcion idempotente en `events.createUser`; envio por cron `GET /api/cron/email-sequence` protegido con `CRON_SECRET`.
- Baja en `/unsubscribe` con confirmacion + `POST /api/unsubscribe` one-click (RFC 8058).

### Admin

- CRUD de programas (`Program.sortOrder`, borrado con confirmacion de slug), modulos y lecciones con filtros por programa.
- `/admin/productos`: CRUD de productos con Stripe Price ID y estado por producto.
- `/admin/usuarios`: fecha de registro, fuente de atribucion y borrado de usuario con confirmacion.
- `/admin/accesos`: accesos manuales; `/admin/early-access` es historico.

## Auth y variables

Auth.js esta configurado con Google OAuth y magic link por correo (Nodemailer sobre SMTP de Resend; `EMAIL_SERVER` + `EMAIL_FROM` lo activan). Tras el magic link el usuario cae en `/acceso-confirmado`.

Variables principales:

- `DATABASE_URL`: conexion PostgreSQL (pooled).
- `DATABASE_URL_UNPOOLED`: conexion directa para CLI/migraciones Prisma.
- `AUTH_SECRET`: secreto largo para Auth.js. Puede generarse con `npx auth secret`.
- `AUTH_URL`: URL base local o productiva.
- `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET`: credenciales OAuth de Google.
- `EMAIL_SERVER` y `EMAIL_FROM`: SMTP para magic links por correo.
- `STRIPE_SECRET_KEY` y `STRIPE_WEBHOOK_SECRET`: Stripe.
- `STRIPE_IDEACASH_PRICE_ID`: solo lo usa el seed; en operacion el Price ID se gestiona por producto en `/admin/productos`.
- `CLOUDFLARE_ACCOUNT_ID` y `CLOUDFLARE_STREAM_TOKEN`: Cloudflare Stream.
- `ANTHROPIC_API_KEY` (y `ASSISTANT_MODEL` opcional): asistente IA.
- `EXTERNAL_API_KEY` (y `PRONOSTIGOL_APP_URL` opcional): API externa de registro.
- `RESEND_API_KEY` y `CRON_SECRET`: drip de onboarding.
- `NEXT_PUBLIC_CLARITY_PROJECT_ID`: Microsoft Clarity.
- `NEXT_PUBLIC_COMMUNITY_URL`: enlace a la comunidad.

Callback local de Google:

```text
http://localhost:3000/api/auth/callback/google
```

## Roles

Los roles base son:

- `INVITADO`
- `USUARIO_PAGO`
- `ADMIN`

Los usuarios nuevos entran como `INVITADO`. El seed crea/actualiza roles base y, si existe `SEED_ADMIN_EMAIL`, crea o promueve ese correo a `ADMIN`. `SEED_ACCESS_EMAIL` permite sembrar un usuario con acceso de prueba.

## Proteccion de rutas

Next.js 16 usa `src/proxy.ts` como reemplazo de middleware:

- `/app/*`: requiere sesion.
- `/admin/*`: requiere sesion y rol `ADMIN`.

## Acceso a contenido

El area de aprendizaje valida permisos del lado servidor:

- programas sin producto asociado: visibles para usuarios autenticados.
- programas asociados a producto: requieren `Access` activo al producto o al programa.
- usuarios `ADMIN`: pueden abrir el area privada sin bloqueo comercial.
- contenido no publicado no aparece en el area de usuario.

## Stripe y accesos

El circuito comercial usa Stripe Checkout:

- `/api/stripe/checkout`: crea una sesion de pago para un producto activo con `stripePriceId` (el Price ID se gestiona por producto en `/admin/productos`).
- `/api/stripe/webhook`: valida la firma de Stripe y procesa `checkout.session.completed` y `checkout.session.async_payment_succeeded`.
- `Purchase`: se registra o actualiza por `stripeCheckoutSessionId`.
- `Access`: se activa por `userId + productId` usando upsert para evitar duplicados.
- `/admin/accesos`: permite crear, editar, activar y desactivar accesos manualmente.

Para probar webhooks localmente, configura `STRIPE_WEBHOOK_SECRET` con el secreto entregado por Stripe CLI o Dashboard y apunta el endpoint a:

```text
http://localhost:3000/api/stripe/webhook
```

## Oferta actual (post-lanzamiento)

- Home reorientada al Agente de Noticias USD 9.99 ("El del Live").
- Claude desde Cero: gratis.
- Builder Multi-IA: USD 47 (insignia destacada).
- La captura de email early-access sigue existiendo como mecanismo secundario.
