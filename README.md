## Centro Builder HeredIA — MVP

Bootstrap tecnico inicial del SaaS Centro Builder HeredIA. Esta base deja una sola app Next.js preparada para rutas publicas, portal de usuario, panel admin, API routes, Prisma/PostgreSQL y despliegue en Vercel.

## Stack

- Next.js con App Router
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL
- Vercel
- Auth.js / NextAuth

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

En produccion/Vercel usa:

```bash
npm run prisma:deploy
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

## Auth y variables

Auth.js esta configurado con Google OAuth y magic link por correo.

Variables requeridas:

- `DATABASE_URL`: conexion PostgreSQL.
- `AUTH_SECRET`: secreto largo para Auth.js. Puede generarse con `npx auth secret`.
- `AUTH_URL`: URL base local o productiva.
- `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET`: credenciales OAuth de Google.
- `EMAIL_SERVER` y `EMAIL_FROM`: SMTP para magic links por correo.

Callback local de Google:

```text
http://localhost:3000/api/auth/callback/google
```

Apple queda preparado solo como placeholder de variables para una fase posterior.

## Roles iniciales

Los roles base son:

- `INVITADO`
- `USUARIO_PAGO`
- `ADMIN`

Los usuarios nuevos entran como `INVITADO`. El seed crea/actualiza roles base y, si existe `SEED_ADMIN_EMAIL`, crea o promueve ese correo a `ADMIN`.

## Proteccion inicial

Next.js 16 usa `src/proxy.ts` como reemplazo de middleware. La proteccion actual es:

- `/app/*`: requiere sesion.
- `/admin/*`: requiere sesion y rol `ADMIN`.

## Proximas fases

- Validar permisos finos en servicios de servidor.
- Construir primera vertical slice de programas, modulos y lecciones.
- Integrar Stripe y webhooks.
- Implementar CRUD admin y reglas de acceso.
