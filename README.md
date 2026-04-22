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
- Stripe Checkout

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
src/lib/stripe                Cliente Stripe server-side
src/lib/permissions           Helpers de rol
src/lib/services              Servicios de dominio
src/lib/validators            Validadores futuros
src/types                     Tipos compartidos
prisma/schema.prisma          Schema Prisma inicial
```

## Rutas placeholder

- Publicas: `/`, `/login`, `/registro`, `/acceso-confirmado`
- Usuario: `/app`, `/app/programas`, `/app/programas/[programSlug]`, `/app/programas/[programSlug]/modulos/[moduleSlug]`, `/app/programas/[programSlug]/lecciones/[lessonSlug]`, `/app/updates`, `/app/perfil`, `/app/soporte`
- Admin: `/admin`, `/admin/programas`, `/admin/modulos`, `/admin/lecciones`, `/admin/videos`, `/admin/updates`, `/admin/usuarios`, `/admin/accesos`
- API: `/api/health`, `/api/stripe/checkout`, `/api/stripe/webhook`

## Auth y variables

Auth.js esta configurado con Google OAuth y magic link por correo.

Variables requeridas:

- `DATABASE_URL`: conexion PostgreSQL.
- `AUTH_SECRET`: secreto largo para Auth.js. Puede generarse con `npx auth secret`.
- `AUTH_URL`: URL base local o productiva.
- `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET`: credenciales OAuth de Google.
- `EMAIL_SERVER` y `EMAIL_FROM`: SMTP para magic links por correo.
- `STRIPE_SECRET_KEY`: clave secreta de Stripe.
- `STRIPE_WEBHOOK_SECRET`: secreto del webhook de Stripe.
- `STRIPE_IDEACASH_PRICE_ID`: Price ID para el producto sembrado.

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

Para probar acceso premium, define `SEED_ACCESS_EMAIL`. El seed crea o actualiza ese usuario como `USUARIO_PAGO` y le da `Access` activo al producto `Build IdeaCash — Founder Access`.

## Proteccion inicial

Next.js 16 usa `src/proxy.ts` como reemplazo de middleware. La proteccion actual es:

- `/app/*`: requiere sesion.
- `/admin/*`: requiere sesion y rol `ADMIN`.

## Acceso a contenido

El area de aprendizaje valida permisos del lado servidor:

- programas sin producto asociado: visibles para usuarios autenticados.
- programas asociados a producto: requieren `Access` activo al producto o al programa.
- usuarios `ADMIN`: pueden abrir el area privada sin bloqueo comercial.
- contenido no publicado no aparece en el area de usuario.

## Progreso basico

El MVP guarda progreso minimo por usuario y leccion:

- `LessonProgress`: una fila por `userId + lessonId`.
- La leccion se marca como completada desde la vista de leccion.
- Dashboard, programa, modulo y leccion muestran avance basico.
- El dashboard recomienda la siguiente leccion pendiente del programa activo.
- Si el programa esta completo, la continuidad vuelve al cierre del programa.

## Stripe y accesos

El circuito comercial minimo usa Stripe Checkout:

- `/api/stripe/checkout`: crea una sesion de pago para un producto activo con `stripePriceId`.
- `/api/stripe/webhook`: valida la firma de Stripe y procesa `checkout.session.completed` y `checkout.session.async_payment_succeeded`.
- `Purchase`: se registra o actualiza por `stripeCheckoutSessionId`.
- `Access`: se activa por `userId + productId` usando upsert para evitar duplicados.
- `/admin/accesos`: permite crear, editar, activar y desactivar accesos manualmente.

Para probar webhooks localmente, configura `STRIPE_WEBHOOK_SECRET` con el secreto entregado por Stripe CLI o Dashboard y apunta el endpoint a:

```text
http://localhost:3000/api/stripe/webhook
```

## Proximas fases

- Mejorar reporting comercial y conciliacion de pagos.
- Conectar estados de compra mas avanzados si el modelo comercial lo requiere.
- Agregar QA funcional con usuarios piloto y escenarios reales de compra.
