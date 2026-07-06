# Visión Técnica Del Sistema

Builder HeredIA es el LMS oficial de Rodrigo HeredIA. Es una aplicación SaaS en una sola base Next.js que combina superficie pública, workspace privado de alumno y panel administrativo.

## Objetivo del producto

El sistema existe para vender, entregar y operar programas privados orientados a construir productos Multi-IA reales. Tras el lanzamiento, la oferta pública se organiza en tres niveles:

```text
Claude desde Cero — gratis
Agente de Noticias "El del Live" — USD 9.99
Builder Multi-IA — USD 47
```

La home está reorientada al Agente de Noticias como producto principal. `Build IdeaCash — Founder Access` fue el primer programa; su página pública `/programas/build-ideacash` es hoy un redirect legacy a `/`.

El producto no está pensado como una academia genérica ni como un Moodle. La experiencia debe sentirse como un workspace premium, guiado y vivo.

## Superficies principales

### Superficie pública

Incluye:

- Home principal `/`
- Páginas públicas de programas `/programas/[slug]` (`/programas/build-ideacash` es hoy un redirect legacy a `/`)
- Embudo de conversión `/bio` (link-in-bio con funnels configurables)
- Redirect medible `/go/whatsapp` hacia el canal de WhatsApp
- Login `/login`
- Registro `/registro`
- Confirmación de acceso por correo `/acceso-confirmado` (magic link)
- Desuscripción del drip de correos `/unsubscribe`

Sirve para posicionamiento, conversión, exploración pública y entrada al sistema.

### Superficie privada de usuario

Vive bajo `/app`.

Incluye:

- Dashboard (incluye el widget del Asistente IA Builder)
- Programas
- Vista de programa
- Vista de módulo
- Vista de lección (con prompts copiables y recursos por lección)
- Biblioteca de Prompts (`/app/biblioteca`)
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
- Productos (CRUD con Stripe Price ID por producto)
- Módulos
- Lecciones (incluye prompts y recursos por lección)
- Videos vinculados a lecciones
- Biblioteca de Prompts (`PromptAsset`)
- Novedades Builder
- Usuarios (con fecha de registro, fuente de signup y resúmenes por atribución)
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
- Cloudflare Stream para video con soporte TUS resumible (chunks de 50MB, archivos hasta ~30GB).
- Resend para correo transaccional y drip de onboarding.
- @anthropic-ai/sdk para el Asistente IA (Claude Haiku).
- Vercel como target de despliegue (incluye Vercel Cron y Analytics; Microsoft Clarity en cliente).

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

- Auth con Google y login por correo mágico (Nodemailer/Resend SMTP, activo cuando `EMAIL_SERVER` + `EMAIL_FROM` están configurados), con confirmación en `/acceso-confirmado`.
- Sesiones en base de datos.
- Roles base.
- Protección de `/app` y `/admin`.
- Checkout Stripe.
- Webhook Stripe.
- Activación automática de `Access`.
- Admin de contenido.
- Admin de accesos.
- Admin de Productos (CRUD con Stripe Price ID por producto).
- Admin de Biblioteca de Prompts (`PromptAsset`).
- Cloudflare Stream con direct upload y subida TUS reanudable.
- Prompts copiables (`LessonPrompt`) y recursos (`LessonResource`) por lección.
- Biblioteca de Prompts en `/app/biblioteca` (premium se desbloquea con cualquier programa de pago).
- Asistente IA Builder en el dashboard (`/api/asistente`, límite 20 mensajes/día por usuario).
- Embudo `/bio` configurable (`bio-config.ts`): cursos gratis → USD 9.99 → USD 47, tarjeta destacada de PronostiGol si `MUNDIAL_ACTIVO`.
- Atribución de marketing: UTMs, cookie `bh_attribution`, tabla `link_click_events` y resúmenes por fuente en `/admin/usuarios`.
- API externa `POST /api/external/registro` (header `X-API-Key`, rate limit 5/min por IP, CORS para PronostiGol).
- Drip de onboarding: 5 correos en 7 días vía Resend + Vercel Cron, con desuscripción one-click.
- Progreso básico por lección.
- Novedades Builder administrables y consumibles.
- Preventa por programa.
- 66 tests con Vitest (validators, attribution, email-sequence, commerce, access-control).

## Lo que esta documentación NO reemplaza

No reemplaza el Documento Maestro Operativo del negocio. Esta documentación explica cómo está construido y cómo mantener el sistema. Las decisiones de estrategia, oferta, calendario y comunicación deben seguir viviendo en el documento operativo del proyecto.

