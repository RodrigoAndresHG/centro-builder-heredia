# Visión Técnica Del Sistema

Builder HeredIA es el LMS oficial de Rodrigo HeredIA. Es una aplicación SaaS en una sola base Next.js que combina superficie pública, workspace privado de alumno y panel administrativo.

## Objetivo del producto

El sistema existe para vender, entregar y operar programas privados orientados a construir productos Multi-IA reales. El primer programa activo es:

```text
Build IdeaCash — Founder Access
```

El producto no está pensado como una academia genérica ni como un Moodle. La experiencia debe sentirse como un workspace premium, guiado y vivo.

## Superficies principales

### Superficie pública

Incluye:

- Home principal `/`
- Página pública del programa `/programas/build-ideacash`
- Login `/login`
- Registro `/registro`
- Confirmación de acceso por correo `/acceso-confirmado`

Sirve para posicionamiento, conversión, exploración pública y entrada al sistema.

### Superficie privada de usuario

Vive bajo `/app`.

Incluye:

- Dashboard
- Programas
- Vista de programa
- Vista de módulo
- Vista de lección
- Novedades Builder
- Perfil
- Soporte

La superficie privada diferencia entre:

- Usuario sin acceso premium.
- Usuario con acceso activo.
- Admin que también puede entrar al workspace sin bloqueo comercial.

### Superficie admin

Vive bajo `/admin`.

Sirve para operar:

- Programas
- Módulos
- Lecciones
- Videos vinculados a lecciones
- Novedades Builder
- Usuarios
- Accesos
- Early Access histórico, accesible por ruta pero fuera del sidebar.

## Stack aprobado

- Next.js 16 con App Router.
- TypeScript.
- Tailwind CSS v4.
- Prisma 7.
- PostgreSQL, actualmente Neon en producción.
- Auth.js / NextAuth v5 beta.
- Stripe Checkout y webhook.
- Cloudflare Stream para video.
- Vercel como target de despliegue.

## Principios de producto que afectan la implementación

- Misma app para público, usuario y admin.
- El usuario inicia sesión antes de comprar por el flujo oficial actual.
- Stripe es el camino comercial sensible para acceso real.
- Admin puede crear accesos manuales, pero no reemplazan Stripe.
- Programa, módulo, lección y video siguen la relación:

```text
Programa -> Módulo -> Lección -> Video dentro de la lección
```

- Las novedades son contenido real administrable, no un feed estático.
- El sistema soporta preventa real con `Program.status = PRESALE`.

## Estado funcional actual

El sistema ya tiene:

- Auth con Google y correo opcional.
- Sesiones en base de datos.
- Roles base.
- Protección de `/app` y `/admin`.
- Checkout Stripe.
- Webhook Stripe.
- Activación automática de `Access`.
- Admin de contenido.
- Admin de accesos.
- Cloudflare Stream con direct upload.
- Progreso básico por lección.
- Novedades Builder administrables y consumibles.
- Preventa por programa.

## Lo que esta documentación NO reemplaza

No reemplaza el Documento Maestro Operativo del negocio. Esta documentación explica cómo está construido y cómo mantener el sistema. Las decisiones de estrategia, oferta, calendario y comunicación deben seguir viviendo en el documento operativo del proyecto.

