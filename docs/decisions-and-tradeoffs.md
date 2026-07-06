# Decisiones Y Tradeoffs

Este documento registra decisiones conscientes para que no se reabran sin contexto.

## Una sola app

Decisión:

- Público, usuario y admin viven en la misma app Next.js.

Motivo:

- Menos infraestructura.
- Menos duplicación.
- Más velocidad para MVP.

Tradeoff:

- Requiere buena separación de rutas y permisos.

## Auth con sesiones DB

Decisión:

- Mantener `session.strategy: "database"`.

Motivo:

- Control operativo.
- Revocación futura.
- Gobernanza de sesiones.

Tradeoff:

- Más dependencia de DB.
- No migrar a JWT por ahora.

## Compra autenticada primero

Decisión:

- Usuario entra con Google antes de checkout.

Motivo:

- Permite asociar compra a identidad real.
- Simplifica activación de acceso.
- Evita compras huérfanas.

Tradeoff:

- Mayor fricción que checkout público directo.

## Access como fuente de permiso real

Decisión:

- Permiso real depende de `Access`.
- Rol ayuda a UI/estado, pero no reemplaza permisos.

Motivo:

- Escala a múltiples productos/programas.
- Permite acceso manual/test.

## Origen de acceso separado de rol

Decisión:

- `Access.source` indica origen:
  - `STRIPE`
  - `MANUAL`
  - `TEST`

Motivo:

- Auditar pago vs habilitación manual.
- No contaminar roles con casos comerciales.

## Preventa a nivel programa

Decisión:

- `Program.status` controla `DRAFT`, `PRESALE`, `OPEN`.

Motivo:

- Vender acceso fundador sin fingir contenido completo abierto.

Tradeoff:

- Las vistas deben tratar `PRESALE` con cuidado.

## Video dentro de lección

Decisión:

- El video se gestiona desde la lección.
- `/admin/videos` es biblioteca/índice.

Motivo:

- El contenido consumible real es la lección.
- Evita flujo confuso de assets separados.

## Cloudflare Stream sin signed URLs por ahora

Decisión:

- `CLOUDFLARE_STREAM_REQUIRE_SIGNED_URLS=false`.
- Playback público por iframe.

Motivo:

- Prioridad actual: operación/lanzamiento.
- Menos complejidad en reproducción.

Tradeoff:

- Hardening de video premium queda pendiente.

## Novedades con detalle por id

Decisión:

- `/app/updates/[id]` en vez de slug editorial.

Motivo:

- Evita migración innecesaria.
- Suficiente para feed privado actual.

Tradeoff:

- URL menos editorial.
- Mejorar con `slug` si Novedades toma más peso público/editorial.

## Stripe idempotente por checkout session

Decisión:

- Idempotencia actual por `stripeCheckoutSessionId`.

Motivo:

- Suficiente para fase actual.
- Stripe checkout session es único y mapea bien a compra.

Tradeoff:

- No dedupe por `event.id` todavía.

## Atribución persistida por Server Action post-login, no en `events.createUser`

Decisión:

- La cookie `bh_attribution` NO se lee dentro de `events.createUser` de Auth.js v5.
- La persistencia confiable la hace el Server Action `persistAttribution()` (`src/lib/actions/attribution.ts`), disparado por `AttributionSync` en el layout de `/app`.

Motivo:

- `cookies()` no funciona de forma confiable dentro de los eventos de Auth.js v5 (contexto de request no garantizado).
- El layout de `/app` siempre corre con request real y sesión activa: primer login garantiza persistencia.

Tradeoff:

- La atribución se graba en el primer acceso a `/app`, no en el instante exacto de creación del usuario.
- `signupSource` sí se setea en `events.createUser` (no depende de cookies).

## Borrar usuario elimina compras a propósito

Decisión:

- `deleteUser` borra en cascada accounts, sessions, accesses, purchases, lessonProgress, assistantUsage y estado de secuencia de email.
- Salvaguardas: confirmación tipeada del email exacto, no auto-borrado, no se puede borrar un `ADMIN`.

Motivo:

- Limpieza total de cuentas de prueba/spam sin filas huérfanas.
- La confirmación tipeada evita borrados accidentales.

Tradeoff:

- Se pierde historial comercial del usuario borrado. No usar para clientes reales con compras que deban auditarse.
- Contraste: borrar un programa preserva `Purchase` (productId a null) para que el historial comercial sobreviva.

## Biblioteca premium vaciada server-side

Decisión:

- El body de un `PromptAsset` premium se vacía en el servidor si el usuario no tiene acceso a un programa de pago.

Motivo:

- El contenido premium nunca viaja al cliente sin permiso; no depende de ocultamiento en UI.

## API externa con API key y rate limit en DB

Decisión:

- `POST /api/external/registro` se protege con header `X-API-Key` comparado timing-safe contra `EXTERNAL_API_KEY`.
- Rate limit de 5/min por IP persistido en la tabla `external_signup_throttle` (no en memoria).
- CORS restringido a `https://pronostigol.rodriheredia.com`; redirect del magic link validado contra allowlist en el callback de Auth.js.

Motivo:

- En serverless (Vercel) no hay memoria compartida entre invocaciones: el throttle debe vivir en DB.
- Allowlist de redirect evita open-redirect vía magic link.

Tradeoff:

- Una key única compartida (no keys por cliente); suficiente con un solo consumidor (PronostiGol).

## Drip de onboarding por cron diario con estado en DB

Decisión:

- Secuencia de 5 emails (días 0/1/3/5/7) impulsada por `EmailSequenceState` y un cron diario (`/api/cron/email-sequence`, 14:00 UTC vía `vercel.json`).
- Envío con Resend usando `idempotencyKey`, máximo 3 intentos por paso, `List-Unsubscribe` + one-click RFC 8058.

Motivo:

- Cron + estado en DB es idempotente y tolerante a reintentos; sin infraestructura de colas.

Tradeoff:

- Granularidad diaria: el email de "día 1" puede llegar con hasta ~24h de desfase respecto a la hora exacta de registro.

## Migraciones con conexión directa (`DATABASE_URL_UNPOOLED`)

Decisión:

- `prisma.config.ts` usa `DATABASE_URL_UNPOOLED` para CLI/migraciones; el runtime sigue usando `DATABASE_URL` (pooled).
- El build de Vercel es `prisma migrate deploy && next build`.

Motivo:

- PgBouncer en modo transacción rompe los advisory locks de Prisma Migrate; la conexión directa lo evita.

Tradeoff:

- Dos URLs de DB que mantener sincronizadas en cada entorno.

