# Handoff Para Nuevo Developer

Este documento es la entrada práctica para retomar Builder HeredIA.

## 1. Qué estás tomando

Estás tomando una app Next.js que ya opera:

- Landing pública.
- Login/registro.
- Workspace privado.
- Admin.
- Stripe checkout/webhook.
- Activación de acceso.
- CRUD de programas/módulos/lecciones.
- Cloudflare Stream para video.
- Novedades Builder.
- Preventa por programa.

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
```

## 3. Variables mínimas para trabajar

Para navegación básica:

- `DATABASE_URL`
- `AUTH_SECRET`
- `AUTH_URL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

Para compra:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_IDEACASH_PRICE_ID`

Para video:

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_STREAM_TOKEN`
- `CLOUDFLARE_STREAM_REQUIRE_SIGNED_URLS=false`

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

## 8. Antes de cambiar algo importante

Lee:

- `decisions-and-tradeoffs.md`
- `known-issues-and-next-steps.md`

Y valida:

```bash
npm run lint
npm run build
```

## 9. Mental model rápido

```text
User tiene roleKey.
Access define permiso real.
Product se vende con Stripe.
Program puede estar DRAFT/PRESALE/OPEN.
Module organiza lecciones.
Lesson contiene contenido, video y preview.
LessonProgress guarda avance.
BuilderUpdate alimenta Novedades.
```

