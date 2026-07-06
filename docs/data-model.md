# Modelo De Datos

El modelo vive en:

```text
prisma/schema.prisma
```

## Auth

### User

Cuenta real del LMS.

Campos clave:

- `id`
- `name`
- `email`
- `emailVerified`
- `image`
- `roleKey`

Campos de atribución de marketing (opcionales, se llenan post-registro):

- `signupSource`: fuente de registro (ej. `bio`, `external:pronostigol`).
- `utmSource`
- `utmMedium`
- `utmCampaign`
- `signupIntent`: intención declarada por el link de origen (ej. curso concreto).

Relaciones:

- `accounts`
- `sessions`
- `accesses`
- `purchases`
- `lessonProgress`
- `assistantUsage`: contador diario de mensajes al asistente IA (límite 20/día).
- `emailSequence`: estado del drip de onboarding (5 correos en 7 días).

`roleKey` no debe confundirse con origen de acceso.

Nota de atribución: la cookie `bh_attribution` se captura en `/registro`, pero la
persistencia confiable ocurre vía Server Action `persistAttribution()` disparada
desde el layout de `/app` (no dentro de `events.createUser` de Auth.js, donde
`cookies()` no funciona de forma confiable).

### Account, Session, VerificationToken

Modelos requeridos por Auth.js Prisma Adapter.

Importante:

- Las sesiones se guardan en DB.
- `Session.sessionToken` es único.
- `VerificationToken` soporta el login por enlace mágico (Nodemailer/Resend).
  El provider se activa solo si existen `EMAIL_SERVER` y `EMAIL_FROM`
  (ver `src/lib/auth/index.ts` y `docs/environment-variables.md`).

### Role

Catálogo de roles:

- `INVITADO`
- `USUARIO_PAGO`
- `ADMIN`

Actualmente `User.roleKey` es string y referencia lógica a `Role.key`, no FK explícita.

## Comercial

### Product

Representa producto comercial vendible.

Campos clave:

- `slug`
- `name`
- `stripePriceId`
- `isActive`

Relaciones:

- `programs`
- `accesses`
- `purchases`

### Purchase

Registro de compra procesada por Stripe.

Campos clave:

- `stripeCheckoutSessionId` único.
- `stripePaymentIntentId`
- `amountCents`
- `currency`
- `status`
- `purchasedAt`

La idempotencia actual se apoya en `stripeCheckoutSessionId`.

### Access

Permiso comercial o manual para consumir producto/programa.

Campos clave:

- `userId`
- `productId`
- `programId`
- `status`
- `source`
- `startsAt`
- `expiresAt`

Índices únicos:

```prisma
@@unique([userId, productId])
@@unique([userId, programId])
```

`source` usa:

- `STRIPE`: acceso comercial por checkout confirmado.
- `MANUAL`: habilitación manual excepcional.
- `TEST`: demo/prueba.

Regla importante:

- Un acceso puede apuntar a producto o a programa.
- En admin se valida que no se elijan ambos a la vez.

## LMS

### Program

Unidad principal de aprendizaje.

Campos clave:

- `slug`
- `title`
- `description`
- `productId`
- `status`
- `opensAt`
- `presaleMessage`
- `isPublished`
- `sortOrder`: `Int`, default 0. Orden de visualización en admin y frontend.

`status` usa:

- `DRAFT`
- `PRESALE`
- `OPEN`

`isPublished` queda como compatibilidad histórica/admin, pero la visibilidad principal de programa usa `status`.

### Module

Pertenece a un programa.

Tiene `sortOrder` (`Int`, default 0) para ordenamiento.

Índice único:

```prisma
@@unique([programId, slug])
```

### Lesson

Pertenece a un programa y opcionalmente a un módulo.

Regla operativa real:

```text
Programa -> Módulo -> Lección -> Video dentro de la lección
```

Campos de video:

- `videoUrl`: compatibilidad externa/manual.
- `videoProvider`: proveedor visible.
- `streamVideoId`: ID de Cloudflare Stream, único.
- `videoStatus`: `NONE`, `UPLOADING`, `PROCESSING`, `READY`, etc.
- `videoTitle`
- `videoThumbnailUrl`
- `videoDuration`
- `isPreview`

Otros campos:

- `sortOrder`: `Int`, default 0, para ordenamiento.

Relaciones nuevas:

- `prompts`: `LessonPrompt[]`
- `resources`: `LessonResource[]`

Índice único:

```prisma
@@unique([programId, slug])
```

El slug de lección es único por programa, no global ni por módulo.

Nota reciente:

- `createLesson` y `updateLesson` derivan `programId` desde el módulo seleccionado para evitar cruces.
- El slug se normaliza y se valida contra duplicados reales excluyendo la lección actual en update.

### LessonPrompt

Prompts copiables asociados a una lección.

Campos:

- `id`
- `lessonId`
- `title`
- `body`: texto del prompt.
- `sortOrder`

Borrado en cascada con la lección.

### LessonResource

Recursos asociados a una lección.

Campos:

- `id`
- `lessonId`
- `title`
- `description`
- `url`
- `type`: enum `LINK` / `DOWNLOAD` / `REFERENCE` (default `LINK`).
- `sortOrder`

Borrado en cascada con la lección.

### LessonProgress

Progreso básico.

Índice único:

```prisma
@@unique([userId, lessonId])
```

Sirve para marcar lección completada y calcular continuidad.

## Novedades

### BuilderUpdate

Publicaciones administrables para Novedades Builder.

Campos:

- `title`
- `type`
- `summary`
- `content`
- `imageUrl`
- `isPublished`
- `publishedAt`

Tipos:

- `NOVEDAD`
- `TIP`
- `IA`
- `RECOMENDACION`

Detalle público privado actual usa `/app/updates/[id]`. No existe slug editorial todavía.

### PromptAsset

Biblioteca pública de prompts (`/app/biblioteca`, administrable en `/admin/biblioteca`).

Campos:

- `title`
- `description`
- `body`: texto del prompt.
- `platform`: enum `CLAUDE` / `CHATGPT` / `GEMINI` / `MULTI` (default `MULTI`).
- `category`
- `isPremium`
- `isPublished`
- `sortOrder`

Regla importante:

- Los prompts premium se desbloquean con cualquier programa de pago.
- Si el usuario no tiene acceso, el `body` premium se vacía server-side
  antes de llegar al cliente (nunca se filtra al navegador).

### AssistantUsage

Contador diario de mensajes al asistente IA por usuario (anti-abuso).

Campos:

- `userId`
- `day`: string del día.
- `count`

Índice único:

```prisma
@@unique([userId, day])
```

Impone el límite de 20 mensajes/día por usuario en `POST /api/asistente`.

### ExternalSignupThrottle

Rate limit por IP+minuto para los endpoints públicos `/api/external/*`
(serverless-safe: el contador vive en la DB, no en memoria del proceso).

Campos:

- `bucket`: único, con formato `<ip>:<minuto-ISO>`.
- `count`

Impone el límite de 5 solicitudes/minuto en `POST /api/external/registro`.
Las filas viejas se pueden purgar luego.

### LinkClickEvent

Clics a links que no aceptan UTMs (ej. el canal de WhatsApp), registrados
vía redirect interno `/go/*` (ej. `/go/whatsapp?src=`) para medir atribución por fuente.

Campos:

- `target`
- `src`
- `createdAt`

### EmailSequenceState

Estado del drip de onboarding por email (5 correos en 7 días: día 0/1/3/5/7),
uno por usuario. La inscripción es idempotente en `events.createUser`.

Campos:

- `userId`: único (una secuencia por usuario).
- `email`
- `step`: índice del PRÓXIMO correo a enviar (0..5). Al llegar a 5 → `done`.
- `status`: enum `pending` / `done` / `unsubscribed` / `failed`.
- `attempts`: reintentos por paso (máximo 3 antes de marcar `failed`).
- `nextSendAt`, `lastSentAt`
- `unsubscribeToken`: único, usado por `/unsubscribe` y por la baja
  one-click RFC 8058 (`POST /api/unsubscribe`, header `List-Unsubscribe`).

El envío lo dispara el cron `GET /api/cron/email-sequence` (Vercel Cron diario).

## Early Access

### EarlyAccessLead

Captura histórica de leads de preventa.

Campos:

- `name`
- `email`
- `source`
- `status`

Sigue existiendo, pero no es la superficie operativa principal actual.

