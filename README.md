## Centro Builder HeredIA — MVP

Bootstrap tecnico inicial del SaaS Centro Builder HeredIA. Esta base deja una sola app Next.js preparada para rutas publicas, portal de usuario, panel admin, API routes, Prisma/PostgreSQL y despliegue en Vercel.

## Stack

- Next.js con App Router
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL
- Vercel

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

Levanta desarrollo:

```bash
npm run dev
```

Verifica compilacion:

```bash
npm run lint
npm run build
```

## Estructura general

```text
src/app/(public)              Rutas publicas
src/app/(user)/app            Portal privado de usuario
src/app/(admin)/admin         Panel administrativo
src/app/api                   Route handlers
src/components/shared         UI reutilizable base
src/components/public         Componentes publicos
src/components/app            Componentes del portal de usuario
src/components/learning       Componentes de aprendizaje
src/components/admin          Componentes admin
src/lib/auth                  Integracion auth futura
src/lib/db                    Prisma y acceso a datos
src/lib/stripe                Integracion Stripe futura
src/lib/permissions           Permisos futuros
src/lib/services              Servicios de dominio futuros
src/lib/validators            Validadores futuros
src/types                     Tipos compartidos
prisma/schema.prisma          Schema Prisma inicial
```

## Rutas placeholder

- Publicas: `/`, `/login`, `/registro`, `/acceso-confirmado`
- Usuario: `/app`, `/app/programas`, `/app/programas/[programSlug]`, `/app/programas/[programSlug]/modulos/[moduleSlug]`, `/app/programas/[programSlug]/lecciones/[lessonSlug]`, `/app/updates`, `/app/perfil`, `/app/soporte`
- Admin: `/admin`, `/admin/programas`, `/admin/modulos`, `/admin/lecciones`, `/admin/videos`, `/admin/updates`, `/admin/usuarios`, `/admin/accesos`
- API: `/api/health`

## Proximas fases

- Definir modelos Prisma y migraciones iniciales.
- Implementar autenticacion real.
- Conectar permisos por rol.
- Construir primera vertical slice de programas, modulos y lecciones.
- Integrar Stripe y webhooks.
- Implementar CRUD admin y reglas de acceso.
