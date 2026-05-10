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

Relaciones:

- `accounts`
- `sessions`
- `accesses`
- `purchases`
- `lessonProgress`

`roleKey` no debe confundirse con origen de acceso.

### Account, Session, VerificationToken

Modelos requeridos por Auth.js Prisma Adapter.

Importante:

- Las sesiones se guardan en DB.
- `Session.sessionToken` es único.

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

`status` usa:

- `DRAFT`
- `PRESALE`
- `OPEN`

`isPublished` queda como compatibilidad histórica/admin, pero la visibilidad principal de programa usa `status`.

### Module

Pertenece a un programa.

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

Índice único:

```prisma
@@unique([programId, slug])
```

El slug de lección es único por programa, no global ni por módulo.

Nota reciente:

- `createLesson` y `updateLesson` derivan `programId` desde el módulo seleccionado para evitar cruces.
- El slug se normaliza y se valida contra duplicados reales excluyendo la lección actual en update.

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

## Early Access

### EarlyAccessLead

Captura histórica de leads de preventa.

Campos:

- `name`
- `email`
- `source`
- `status`

Sigue existiendo, pero no es la superficie operativa principal actual.

