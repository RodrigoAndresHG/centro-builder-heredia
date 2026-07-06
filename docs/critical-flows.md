# Flujos Críticos

Este documento resume los recorridos que deben probarse antes de desplegar cambios sensibles.

## 1. Login (Google y enlace mágico)

Archivos:

```text
src/lib/auth/index.ts
src/app/api/auth/[...nextauth]/route.ts
src/proxy.ts
src/app/(public)/login/page.tsx
src/app/(public)/registro/page.tsx
src/app/(public)/acceso-confirmado
```

Flujo (Google):

1. Usuario entra a `/login` o `/registro`.
2. Hace click en continuar con Google.
3. Auth.js crea/actualiza `User` y `Account`.
4. Se crea `Session` en DB.
5. Callback agrega `id` y `role` a la sesión.
6. Usuario vuelve al callback o a `/app`.

Flujo (enlace mágico, requiere `EMAIL_SERVER` y `EMAIL_FROM`):

1. Usuario escribe su email en `/login` o `/registro`.
2. Auth.js (provider Nodemailer) envía el enlace por SMTP.
3. Se muestra `/acceso-confirmado` (página `verifyRequest`).
4. Al hacer clic en el enlace, se crea/actualiza `User` y se crea `Session`.

En ambos casos, si el usuario es nuevo, `events.createUser` lo inscribe en el drip de onboarding (flujo 16) e intenta la atribución best-effort (flujo 14).

Validar:

- `User.email` existe.
- `Session` se crea.
- `/app` abre.
- `/admin` redirige si no es admin.
- Con email sin configurar, no aparece la opción de enlace mágico ni errores técnicos.

## 2. Compra oficial por Stripe

Archivos:

```text
src/app/api/stripe/checkout/route.ts
src/app/api/stripe/webhook/route.ts
src/lib/services/commerce.ts
```

Flujo:

1. Usuario autenticado presiona comprar/activar acceso.
2. `/api/stripe/checkout` valida sesión.
3. Se busca `Product` activo.
4. Se valida `stripePriceId`.
5. Se valida que el producto tenga programa `PRESALE` u `OPEN`.
6. Stripe crea checkout.
7. Webhook recibe confirmación.
8. `Purchase` se crea/actualiza por `stripeCheckoutSessionId`.
9. `Access` se activa con `source = STRIPE`.
10. Usuario queda como `USUARIO_PAGO` si no es admin.

Validar:

- Checkout abre.
- Webhook firma correctamente.
- `Purchase.status = PAID`.
- `Access.status = ACTIVE`.
- `Access.source = STRIPE`.
- `/app` muestra dashboard de usuario con acceso.

## 3. Acceso manual admin

Archivos:

```text
src/app/(admin)/admin/accesos/nuevo/page.tsx
src/components/admin/access/access-form.tsx
src/lib/actions/admin-access.ts
```

Flujo:

1. Admin entra a `/admin/accesos/nuevo`.
2. Selecciona usuario existente.
3. Selecciona producto o programa.
4. Elige `MANUAL` o `TEST`.
5. Define estado y fechas.
6. Se crea `Access`.

Validar:

- No crea usuarios nuevos.
- Bloquea duplicados por usuario/producto o usuario/programa.
- No permite seleccionar producto y programa a la vez.
- No confunde con Stripe.

## 4. Crear contenido

Archivos:

```text
src/lib/actions/admin-content.ts
src/components/admin/content/content-forms.tsx
```

Flujo:

1. Crear programa.
2. Crear módulo asociado a programa.
3. Crear lección asociada a módulo.
4. Publicar lo necesario.
5. Subir video desde la lección.

Regla:

```text
Programa -> Módulo -> Lección -> Video
```

Validar:

- Slug de módulo único por programa.
- Slug de lección único por programa.
- La lección deriva `programId` desde el módulo.
- Video queda en la lección.

## 5. Preventa

Archivos:

```text
src/lib/services/learning.ts
src/lib/services/commerce.ts
src/app/(user)/app/programas/[programSlug]/page.tsx
```

Flujo:

1. Admin define programa como `PRESALE`.
2. Producto sigue comprable.
3. Usuario compra.
4. Usuario con acceso entra al programa.
5. Ve bloque premium de preventa.
6. Mapa visible.
7. Lecciones no preview quedan bloqueadas hasta apertura.

Validar:

- `DRAFT` no aparece.
- `PRESALE` aparece y permite compra.
- `OPEN` consume normalmente.
- `isPreview` abre lección en preventa.

## 6. Cloudflare Stream (TUS reanudable)

Archivos:

```text
src/app/api/admin/cloudflare-stream/direct-upload/route.ts
src/app/api/admin/cloudflare-stream/complete/route.ts
src/lib/services/cloudflare-stream.ts
src/components/admin/content/cloudflare-stream-upload.tsx
```

Flujo:

1. Admin edita lección.
2. El backend pide a Cloudflare una URL de direct upload (`maxDurationSeconds: 7200`).
3. DB guarda `streamVideoId` y estado `UPLOADING`.
4. El browser sube el archivo con **TUS reanudable** (`tus-js-client`) contra esa URL:
   - Chunks de 50 MB (múltiplo de 256 KiB, requisito de Cloudflare).
   - Reintentos automáticos con backoff (`retryDelays: 0/3/6/12/24 s`).
   - Progreso y recuperación por chunk; soporta archivos grandes (hasta ~30 GB).
5. Al terminar, el frontend avisa a `/complete`.
6. DB pasa a `PROCESSING`.
7. Usuario con acceso reproduce iframe si hay `streamVideoId`.

La asociación video ↔ lección es manual por UID: el `streamVideoId` que devuelve el direct upload se guarda en la lección al iniciar la subida.

Validar:

- Token Cloudflare no llega al browser (solo la `uploadUrl` de un solo uso).
- La subida se reanuda tras un corte de red (reintentos TUS).
- Video se carga desde lección.
- `CLOUDFLARE_STREAM_REQUIRE_SIGNED_URLS=false` en fase actual.

## 7. Progreso de lección

Archivos:

```text
src/lib/actions/progress.ts
src/lib/services/progress.ts
```

Flujo:

1. Usuario abre lección con acceso permitido.
2. Marca completada.
3. `LessonProgress` se upsertea por `userId + lessonId`.
4. Dashboard/programa/módulo recalculan progreso.

Validar:

- Usuario sin acceso no puede marcar.
- La siguiente lección se calcula correctamente.

## 8. Novedades Builder

Archivos:

```text
src/lib/services/builder-updates.ts
src/app/(admin)/admin/updates
src/app/(user)/app/updates
```

Flujo:

1. Admin crea novedad.
2. Publica.
3. Usuario ve feed.
4. Filtro por categoría funciona.
5. Detalle `/app/updates/[id]` muestra contenido completo.

Validar:

- Solo se muestran `isPublished = true`.
- Paginación funciona.
- No se muestra contenido largo en listado.

## 9. Prompts de lección

Archivos:

```text
prisma/schema.prisma (modelo LessonPrompt)
src/lib/actions/admin-content.ts
src/components/admin/content/content-forms.tsx
src/app/(user)/app/programas/[programSlug]/lecciones/[lessonSlug]/page.tsx
```

Flujo:

1. Admin agrega prompts (`title` + `body`, con `sortOrder`) a una lección.
2. La página de lección los muestra en su propia sección, copiables con un clic.

Validar:

- Los prompts respetan el orden (`sortOrder`).
- Solo aparecen en la lección a la que pertenecen.
- Se eliminan en cascada al borrar la lección.

## 10. Recursos de lección

Archivos:

```text
prisma/schema.prisma (modelo LessonResource)
src/lib/actions/admin-content.ts
src/components/admin/content/content-forms.tsx
src/app/(user)/app/programas/[programSlug]/lecciones/[lessonSlug]/page.tsx
```

Flujo:

1. Admin agrega recursos a una lección: `title`, `description` opcional, `url` y `type` (`LINK`, `DOWNLOAD` o `REFERENCE`).
2. La página de lección los lista en su sección de recursos.

Validar:

- El tipo se refleja correctamente en la UI.
- Respetan el orden (`sortOrder`).
- Se eliminan en cascada al borrar la lección.

## 11. Biblioteca de Prompts

Archivos:

```text
prisma/schema.prisma (modelo PromptAsset)
src/lib/services/prompt-assets.ts
src/app/(user)/app/biblioteca/page.tsx
src/components/app/prompt-library.tsx
src/app/(admin)/admin/biblioteca
```

Flujo:

1. Admin gestiona `PromptAsset` en `/admin/biblioteca`: `platform` (`CLAUDE`/`CHATGPT`/`GEMINI`/`MULTI`), `category`, `isPremium`, `isPublished`.
2. Usuario autenticado entra a `/app/biblioteca` y ve los prompts publicados, organizados por categoría y filtrables por plataforma.
3. Los premium se desbloquean con cualquier programa de pago (rol `USUARIO_PAGO`) o siendo admin.
4. Si el usuario no tiene acceso, el `body` premium se vacía **del lado servidor** (nunca viaja al cliente) y la tarjeta aparece bloqueada.

Validar:

- Solo aparecen `isPublished = true`.
- Un `INVITADO` no recibe el cuerpo de prompts premium (revisar payload, no solo UI).
- Copiar al portapapeles funciona.

## 12. Asistente IA (Asistente Builder)

Archivos:

```text
src/components/app/assistant-widget.tsx
src/app/api/asistente/route.ts
src/lib/services/assistant.ts
prisma/schema.prisma (modelo AssistantUsage)
```

Flujo:

1. Usuario autenticado abre el widget flotante en `/app`.
2. El widget hace `POST /api/asistente` con el historial de mensajes.
3. El backend valida sesión, configuración (`ANTHROPIC_API_KEY`; modelo `ASSISTANT_MODEL`, por defecto `claude-haiku-4-5` vía `@anthropic-ai/sdk`) y cuota.
4. Cuota: 20 mensajes por día por usuario, contados en la tabla `assistant_usage` (`userId + day`).
5. El asistente responde con conocimiento estático del LMS más programas y precios reales leídos de la DB.

Validar:

- Sin sesión → 401.
- Sin `ANTHROPIC_API_KEY` → 503 con mensaje amable.
- Mensaje 21 del día → 429 con el límite explicado.
- Los precios que menciona coinciden con los productos activos.

## 13. Embudo /bio

Archivos:

```text
src/app/bio/bio-config.ts
src/app/bio/page.tsx
src/app/bio/open-in-browser-banner.tsx
```

Flujo:

1. Visitante llega a `/bio` (link-in-bio de TikTok/Instagram), opcionalmente con `?src=X`.
2. La página se configura solo desde `bio-config.ts`: perfil, cursos y redes.
3. Orden de embudo: curso gratis (héroe, `intent=explore`) → tripwire USD 9.99 → flagship USD 47 (`intent=buy`).
4. Tarjeta del Mundial (PronostiGol) visible solo con el flag `MUNDIAL_ACTIVO` (apagar tras el 19-jul-2026).
5. Link al canal de WhatsApp vía `/go/whatsapp?src=` (flujo 14).
6. `OpenInBrowserBanner` sugiere abrir en el navegador real cuando se detecta un webview in-app.

Validar:

- Los CTAs llevan a `/registro` con UTMs correctos según el `?src=` de la visita.
- Con `MUNDIAL_ACTIVO = false` desaparece la tarjeta de PronostiGol sin tocar nada más.

## 14. Atribución de marketing

Archivos:

```text
src/lib/attribution.ts
src/components/public/attribution-capture.tsx
src/lib/actions/attribution.ts
src/components/app/attribution-sync.tsx
src/app/go/whatsapp/route.ts
```

Flujo:

1. `/bio?src=X` normaliza `src` (slug seguro; inválido → `bio`) y arma links a `/registro?intent=...&utm_source=X&utm_medium=bio&utm_campaign=empieza`.
2. `/registro` monta `AttributionCapture`: guarda los UTMs + `intent` en la cookie `bh_attribution` (first-party, `SameSite=Lax`, `max-age` 1 h).
3. Tras el login, el layout de `/app` monta `AttributionSync`, que dispara el Server Action `persistAttribution()`.
4. `persistAttribution()` escribe `User.utmSource/utmMedium/utmCampaign/signupIntent` con semántica de primer toque y borra la cookie (un solo uso). En `events.createUser` hay un intento best-effort previo, pero `cookies()` no es confiable ahí (ver `auth-and-sessions.md`).
5. `User.signupSource` marca registros llegados por la API externa (flujo 15).
6. Clics al canal de WhatsApp (no acepta UTMs) se miden con el redirect `/go/whatsapp?src=`: registra un `LinkClickEvent` (`target = "whatsapp"`) y hace 302 al canal; nunca bloquea el redirect si el registro falla.
7. `/admin/usuarios` muestra resúmenes por fuente y la columna Fuente por usuario.

Validar:

- Registro desde `/bio?src=tiktok` termina con `utmSource = "tiktok"` en el usuario.
- Un usuario con fuente previa no se sobreescribe (primer toque).
- `/go/whatsapp` redirige aunque la DB falle.

## 15. API externa de registro

Archivos:

```text
src/app/api/external/registro/route.ts
src/lib/services/external-registro.ts
src/lib/external/config.ts
prisma/schema.prisma (modelo ExternalSignupThrottle)
```

Flujo:

1. PronostiGol hace `POST /api/external/registro` con header `X-API-Key` y body `{ email, signupSource, partidoId? }`.
2. La key se compara en tiempo constante contra `EXTERNAL_API_KEY` (`timingSafeEqual`); sin env configurada → 503.
3. Requiere email configurado (`EMAIL_SERVER` + `EMAIL_FROM`); si falta → 503.
4. Rate limit de 5/min por IP en la tabla `external_signup_throttle` (contador en DB, serverless-safe) → 429 al excederse.
5. CORS restringido a `PRONOSTIGOL_ORIGIN` (de `PRONOSTIGOL_APP_URL`, por defecto `https://pronostigol.rodriheredia.com`); `OPTIONS` responde el preflight.
6. Se crea/reusa el usuario y se dispara el magic link con `redirectTo` de vuelta a PronostiGol (con `partidoId` si vino); la allowlist `TRUSTED_EXTERNAL_ORIGINS` en el callback `redirect` de Auth.js permite ese destino.

Validar:

- Key inválida → 401 sin filtrar información por timing.
- Sexta solicitud en el mismo minuto desde la misma IP → 429.
- El magic link vuelve a PronostiGol tras verificarse.

## 16. Drip de onboarding por email

Archivos:

```text
src/lib/services/email-sequence.ts
src/lib/email/onboarding-emails.ts
src/lib/email/run-sequence.ts
src/lib/email/resend.ts
src/app/api/cron/email-sequence/route.ts
src/app/unsubscribe/page.tsx
src/app/api/unsubscribe/route.ts
vercel.json
```

Flujo:

1. Al crearse un usuario, `events.createUser` llama `enrollUserInOnboarding` (idempotente: no duplica ni reinicia) y crea su `EmailSequenceState` (`step`, `status` `pending/done/unsubscribed/failed`, `attempts`, `unsubscribeToken`).
2. Secuencia de 5 emails en 7 días: offsets día 0, 1, 3, 5 y 7, anclados a la fecha de inscripción (sin drift).
3. El cron de Vercel llama `GET /api/cron/email-sequence` a diario a las 14:00 UTC, autorizado con `Authorization: Bearer ${CRON_SECRET}` (comparación en tiempo constante).
4. Los envíos van por Resend (`RESEND_API_KEY`) con `idempotencyKey` por estado+paso (evita doble envío en reintentos) y headers `List-Unsubscribe` + `List-Unsubscribe-Post` (one-click RFC 8058).
5. Reintentos: cada fallo marca el estado como `failed` e incrementa `attempts`; el cron sigue reintentando en corridas siguientes hasta 3 intentos por paso (un envío exitoso resetea el presupuesto para el próximo correo).
6. Baja: `/unsubscribe?token=...` con confirmación en página, y `POST /api/unsubscribe` para el one-click de Gmail/Outlook/Apple Mail (responde 200 aunque el token no exista, para no revelar validez).

Validar:

- Registro nuevo crea `EmailSequenceState` con `step = 0` y `nextSendAt` inmediato.
- El cron sin `CRON_SECRET` correcto → 401.
- Tras darse de baja, el cron no vuelve a enviar (`status = unsubscribed`).

## Actualizaciones administrativas posteriores

Cambios de admin que tocan estos flujos y también deben probarse tras cambios sensibles:

- **Admin Productos**: CRUD de productos con Stripe Price ID por producto (afecta el flujo 2).
- **Ordenamiento**: `Program.sortOrder` controla el orden de programas en las vistas.
- **Filtros por programa** en los listados admin de módulos y lecciones.
- **Borrados con confirmación**: borrar un programa exige escribir su slug (`confirmSlug`); borrar un usuario exige escribir su email exacto, no aplica a admins, y elimina en cascada (a propósito) sus compras, accesos, sesiones y progreso.
- **`/admin/usuarios`**: columnas de fecha de registro y Fuente (atribución), con resúmenes por fuente.

