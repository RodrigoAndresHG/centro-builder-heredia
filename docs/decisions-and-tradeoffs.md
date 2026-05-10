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

