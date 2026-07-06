# Rutas Y Superficies

Este documento lista las rutas principales y su propósito actual.

## Público

```text
/
```

Home pública. Posiciona Builder como LMS oficial y está reorientada al Agente de Noticias USD 9.99 ("El del Live"), con Claude desde Cero gratis y Builder Multi-IA USD 47. Mantiene captura de email early-access.

```text
/programas/[slug]
```

Páginas públicas de programas. `/programas/build-ideacash` es hoy un redirect legacy a `/`.

```text
/bio
```

Embudo de conversión tipo link-in-bio. Funnels configurables en `bio-config.ts`: 3 tiers (gratis → USD 9.99 → USD 47), tarjeta destacada de PronostiGol si `MUNDIAL_ACTIVO`, y enlace al canal de WhatsApp. Incluye `OpenInBrowserBanner` para navegadores in-app. `/bio?src=X` construye links salientes con UTMs.

```text
/go/whatsapp
```

Redirect medible al canal de WhatsApp. Registra el clic (con `?src=`) en `link_click_events` y responde 302.

```text
/login
/registro
```

Pantallas premium de entrada. Google es el método principal. El login por enlace mágico está disponible si SMTP está configurado (`EMAIL_SERVER` + `EMAIL_FROM`). `/registro` monta `AttributionCapture`, que guarda la cookie `bh_attribution` con los UTMs.

```text
/acceso-confirmado
```

Pantalla de confirmación para magic link por correo.

```text
/unsubscribe
```

Desuscripción del drip de correos con paso de confirmación.

## Workspace de usuario

Todas requieren sesión.

```text
/app
```

Dashboard privado. Cambia según acceso:

- Sin acceso: showroom premium del ecosistema Builder.
- Con acceso: continuidad, progreso y siguiente paso.

Incluye el widget del Asistente IA Builder (chat contra `/api/asistente`). El layout de `/app` monta `AttributionSync`, que persiste la atribución de la cookie al usuario vía Server Action `persistAttribution()`.

```text
/app/programas
```

Mapa del ecosistema Builder. Muestra programa destacado y próximos recorridos.

```text
/app/programas/[programSlug]
```

Mapa de un programa. Aplica permisos, preventa, progreso y módulos.

```text
/app/programas/[programSlug]/modulos/[moduleSlug]
```

Vista de módulo. Lista lecciones y estado de acceso/preview.

```text
/app/programas/[programSlug]/lecciones/[lessonSlug]
```

Vista de lección. Reproduce video si existe, muestra contenido, progreso y navegación anterior/siguiente. Incluye prompts copiables (`LessonPrompt`) y recursos (`LessonResource`) de la lección.

```text
/app/biblioteca
```

Biblioteca de Prompts. Grid compacto con filtros por plataforma (`CLAUDE`, `CHATGPT`, `GEMINI`, `MULTI`) y categoría. Los prompts premium se desbloquean con cualquier programa de pago; sin acceso, el cuerpo premium se vacía server-side.

```text
/app/updates
/app/updates/[id]
```

Novedades Builder. El listado tiene filtros, destacada, grid compacto y paginación. El detalle muestra contenido completo.

```text
/app/perfil
```

Claridad de cuenta: identidad, email, estado de acceso y ayuda si compró pero no ve acceso.

```text
/app/soporte
```

Centro de ayuda v1 con FAQs, contacto por mailto y CTAs contextuales.

## Admin

Todas requieren rol admin.

```text
/admin
```

Dashboard administrativo.

```text
/admin/programas
/admin/programas/nuevo
/admin/programas/[id]
```

CRUD de programas. Incluye estado comercial `DRAFT`, `PRESALE`, `OPEN`, fecha `opensAt`, mensaje de preventa y orden manual (`Program.sortOrder`). El borrado de programa exige confirmar escribiendo el slug (`confirmSlug`).

```text
/admin/productos
/admin/productos/nuevo
/admin/productos/[id]
```

CRUD de Productos. Asocia `stripePriceId` por producto para usarlo en el checkout de múltiples programas.

```text
/admin/modulos
/admin/modulos/nuevo
/admin/modulos/[id]
```

CRUD de módulos, con filtro por programa.

```text
/admin/lecciones
/admin/lecciones/nueva
/admin/lecciones/[id]
```

CRUD de lecciones, con filtro por programa. El video se gestiona desde la lección: direct upload, subida TUS reanudable (chunks de 50MB, hasta ~30GB) y asociación manual por UID. Además, por lección se administran:

- Prompts copiables (`LessonPrompt`).
- Recursos (`LessonResource`: `LINK`, `DOWNLOAD`, `REFERENCE`).

```text
/admin/videos
```

Biblioteca/índice operativo de videos asociados a lecciones. No es el punto principal de carga.

```text
/admin/updates
/admin/updates/nuevo
/admin/updates/[id]
```

CRUD de Novedades Builder.

```text
/admin/biblioteca
/admin/biblioteca/nuevo
/admin/biblioteca/[id]
```

CRUD de la Biblioteca de Prompts (`PromptAsset`): plataforma, categoría, `isPremium`, `isPublished`.

```text
/admin/usuarios
```

Resumen maestro de cuentas reales del LMS. Incluye columnas de fecha de registro y Fuente (atribución de signup), resúmenes por fuente, y borrado de usuario con confirmación (elimina también sus compras, a propósito).

```text
/admin/accesos
/admin/accesos/nuevo
/admin/accesos/[id]
```

Gestión de accesos. `Nuevo acceso` es manual/test y no reemplaza Stripe.

```text
/admin/early-access
```

Vista histórica de leads de acceso temprano. La ruta existe, pero salió del sidebar admin porque ya no es superficie operativa principal.

## API routes

```text
/api/auth/[...nextauth]
```

Auth.js handlers.

```text
/api/stripe/checkout
```

Crea sesión Stripe Checkout para usuario autenticado.

```text
/api/stripe/webhook
```

Procesa eventos Stripe y activa acceso.

```text
/api/admin/cloudflare-stream/direct-upload
```

Crea URL de direct upload de Cloudflare Stream para una lección.

```text
/api/admin/cloudflare-stream/complete
```

Marca una lección con `streamVideoId` y estado `PROCESSING`.

```text
/api/early-access
```

Captura leads históricos de acceso temprano.

```text
/api/asistente
```

Chat con el Asistente IA Builder. `POST` con `{ message }`. Claude Haiku vía `@anthropic-ai/sdk`, límite 20 mensajes/día por usuario.

```text
/api/cron/email-sequence
```

Drip de onboarding: 5 correos en 7 días vía Resend. `GET` diario disparado por Vercel Cron (14:00 UTC), autenticado con `CRON_SECRET`.

```text
/api/external/registro
```

Integración con PronostiGol. `POST` con header `X-API-Key` (comparación timing-safe), rate limit 5/min por IP. Dispara magic link con redirect de vuelta a PronostiGol.

```text
/api/unsubscribe
```

Desuscripción one-click RFC 8058. `POST` con token.

```text
/api/health
```

Health check básico.

