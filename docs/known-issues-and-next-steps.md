# Pendientes, Riesgos Y Deuda Técnica

Este documento lista lo que debe saberse antes de tocar el sistema.

## Cloudflare Stream signed URLs

Estado actual:

- No activas.
- `CLOUDFLARE_STREAM_REQUIRE_SIGNED_URLS=false`.
- Playback actual usa iframe público.

Riesgo:

- Si se activa `requireSignedURLs` sin implementar signed playback, videos pueden dejar de reproducirse.

Siguiente paso recomendado:

1. Crear servicio server-side para firmar playback.
2. Validar `Access` antes de emitir token.
3. Expirar tokens.
4. Activar `CLOUDFLARE_STREAM_REQUIRE_SIGNED_URLS=true`.

## Stripe dedupe por event.id

Estado actual:

- No endurecido por `event.id`.
- Idempotencia por `stripeCheckoutSessionId`.

Riesgo:

- Suficiente para fase actual, pero menos auditable a nivel evento webhook.

Siguiente paso:

- Crear tabla `StripeWebhookEvent` con `eventId` único.
- Guardar evento procesado.
- Ignorar eventos repetidos.

## `.env.example` vs variables opcionales usadas

El código usa variables opcionales para branding Stripe:

- `STRIPE_CHECKOUT_LOGO_FILE_ID`
- `STRIPE_CHECKOUT_ICON_FILE_ID`

Revisar si conviene agregarlas a `.env.example`.

## Novedades sin slug editorial

Estado actual:

- Detalle por `/app/updates/[id]`.

Siguiente paso si se necesita URL editorial:

- Agregar `slug`.
- Validar unicidad.
- Migrar rutas.

## Early Access histórico

Estado actual:

- Modelo, endpoint y página admin existen.
- Salió del sidebar.

Riesgo:

- Puede confundir si alguien entra directo y lo toma como operación actual.

Recomendación:

- Mantener como histórico hasta decidir archivado real.

## Admin aún sin auditoría avanzada

No existe:

- Log de cambios admin.
- Historial de edición de contenido.
- Usuario que creó/editó.

Recomendado si crece el equipo:

- `createdById`
- `updatedById`
- tabla de audit log.

## Accesos manuales

El flujo está claro, pero sigue siendo poderoso.

Riesgos:

- Un admin puede habilitar acceso fuera de Stripe.
- Puede usarse mal si no se respeta el copy operativo.

Recomendación:

- Mantenerlo para demos/pruebas/excepciones.
- Agregar audit log si hay más operadores.

## Progreso básico

Estado actual:

- Completar lección.
- Cálculo de porcentaje.
- Siguiente lección.

No existe todavía:

- Desmarcar completada.
- Progreso por módulo persistido.
- Tiempo visto de video.
- Analytics de consumo.

## Webhooks Cloudflare

No implementados.

Actualmente el estado puede refrescarse vía servicios admin que consultan Cloudflare, pero no hay webhook push robusto.

## Tests automatizados

No hay suite formal de tests e2e/unit documentada en scripts.

Recomendado:

- Tests de servicios críticos: access-control, commerce, learning.
- E2E smoke para login, checkout mock, admin content.

## Cuidado con cambios de slug

Lección:

- Slug único por programa.
- Update excluye la lección actual.
- Cambiar slug cambia URL privada de la lección.

Si ya hay usuarios con enlaces guardados, considerar redirecciones futuras.

## Seguridad de contenido premium

La validación server-side protege rutas. Pero video con iframe público no es hardening completo.

Ver sección Cloudflare signed URLs antes de prometer protección fuerte de assets.

