# Arquitectura General

Builder HeredIA usa una arquitectura monolítica modular sobre Next.js App Router. No hay microservicios. La separación se hace por rutas, componentes, servicios y acciones server-side.

## Capas principales

```text
src/app
  Rutas, layouts, route handlers y server components.

src/components
  UI compartida, pública, privada y admin.

src/lib/actions
  Server actions para mutaciones admin y progreso.

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

Next.js 16 usa `proxy.ts` como reemplazo de middleware.

## Server components y server actions

La mayoría de páginas privadas/admin son server components. Las mutaciones usan server actions:

- `src/lib/actions/admin-content.ts`
- `src/lib/actions/admin-access.ts`
- `src/lib/actions/progress.ts`

Route handlers se usan cuando la integración necesita endpoint HTTP:

- Auth.js.
- Stripe checkout/webhook.
- Early Access.
- Cloudflare Stream direct upload.

## Servicios de dominio

Servicios importantes:

- `learning.ts`: programas visibles, programa por slug, módulo, lección.
- `access-control.ts`: permisos comerciales.
- `commerce.ts`: checkout, compra, activación de acceso.
- `cloudflare-stream.ts`: Cloudflare API y metadata.
- `builder-updates.ts`: novedades admin/publicadas.
- `progress.ts`: avance por lección.
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

## Integraciones externas

### Auth

Auth.js con Prisma Adapter y sesiones persistidas en DB.

### Stripe

Checkout se crea desde `/api/stripe/checkout`. Webhook procesa confirmación y activa acceso.

### Cloudflare Stream

Admin solicita URL de direct upload. El archivo sube directo a Cloudflare. La DB guarda metadata y `streamVideoId`, no binarios.

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

