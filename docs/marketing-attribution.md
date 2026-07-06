# Embudo /bio y atribución de marketing

El sistema mide de dónde viene cada registro (TikTok, Instagram, bio, etc.) con un embudo medible: `/bio?src=X` → `/registro` con UTMs → cookie → persistencia en el `User` tras el login. Los clics al canal de WhatsApp (que no acepta UTMs) se miden con un redirect interno.

## Página /bio (link-in-bio)

- Ruta: `src/app/bio/page.tsx`. Config editable en `src/app/bio/bio-config.ts` — es el ÚNICO archivo que se toca para cambiar foto, textos y links.
- Orden pensado como embudo: curso gratis "Claude desde Cero" (héroe, `intent: "explore"`) → tripwire USD 9.99 "Agente de Noticias de IA" → flagship USD 47 "Builder Multi-IA" (ambos `intent: "buy"`).
- `?src=` identifica la fuente de la visita (ej. `/bio?src=tiktok`). `normalizeSrc()` lo sanea a un slug `[a-z0-9_-]{1,20}`; si no es válido cae a `"bio"`.
- Cada tarjeta de curso enlaza con `buildRegistroHref(intent, src)` → `/registro?intent=...&utm_source=<src>&utm_medium=bio&utm_campaign=empieza`.
- **Tarjeta Mundial (PronostiGol)**: visible solo si `MUNDIAL_ACTIVO = true` en `bio-config.ts`. Ponerla en `false` después del 19-jul-2026 la oculta sin tocar nada más. Su link agrega `utm_source=<src>&utm_medium=bio` hacia `https://pronostigol.rodriheredia.com`.
- **Canal de WhatsApp**: el botón NO enlaza directo al canal; pasa por `/go/whatsapp?src=<src>` (ver abajo). La URL real del canal vive únicamente en `getCommunityUrl()` (`src/lib/community.ts`).
- `OpenInBrowserBanner` (`src/app/bio/open-in-browser-banner.tsx`): aviso para in-app browsers (TikTok/Instagram) sugiriendo abrir en el navegador.

## Cookie bh_attribution (captura en /registro)

`src/components/public/attribution-capture.tsx`, montado en `/registro`:

- Si la URL trae `utm_source`, escribe la cookie `bh_attribution` (constante `ATTRIBUTION_COOKIE`) con `{ source, medium, campaign, intent, ts }`.
- `SameSite=Lax` a propósito: sobrevive el redirect de Google OAuth y el clic del magic link (ambos son navegaciones GET de nivel superior). `Secure` en https. `max-age=3600` (1 h de margen para completar el flujo de login).
- Solo escribe si viene `utm_source` — no pisa una atribución previa con vacío.

Helpers puros (sin dependencias, usables en cliente y servidor) en `src/lib/attribution.ts`: `normalizeSrc`, `buildRegistroHref`, `parseAttributionCookie` (sanea y recorta a 60 chars), `computeAttributionUpdate`. Tests en `src/lib/attribution.test.ts`.

## Persistencia: por qué vive en un Server Action y no en events.createUser

Decisión clave del diseño:

- Dentro de `events.createUser` de Auth.js v5, el acceso a `cookies()` de `next/headers` **no es confiable**: depende de la propagación del contexto de request a través de `@auth/core` y puede fallar silenciosamente tras el round-trip de Google OAuth.
- Por eso `events.createUser` (en `src/lib/auth/index.ts`) hace solo un intento **best-effort** (import dinámico de `next/headers`, envuelto en try/catch), y **no** es la fuente de verdad.
- La captura **confiable** es el Server Action `persistAttribution()` (`src/lib/actions/attribution.ts`), disparado por el componente `AttributionSync` (`src/components/app/attribution-sync.tsx`) montado en el layout de `/app` (`src/app/(user)/app/layout.tsx`). Un Server Action corre en un POST del mismo origen, donde `cookies()` SIEMPRE tiene contexto de request y la cookie llega sin depender de SameSite.

Comportamiento de `persistAttribution()`:

- Requiere sesión; lee la cookie; aplica `computeAttributionUpdate` con semántica de **primer toque** (si el usuario ya tiene `utmSource`, no se reescribe).
- Cookie de un solo uso: se borra en el `finally`, se haya persistido o no.
- `AttributionSync` solo llama al servidor si de verdad existe la cookie (evita un POST en cada carga de `/app`) y una sola vez por montaje.

Campos persistidos en `User`: `utmSource`, `utmMedium`, `utmCampaign`, `signupIntent` (`explore`/`buy`). Aparte existe `signupSource` (lo escribe el registro externo de PronostiGol, no este flujo).

## /go/whatsapp y link_click_events

El canal de WhatsApp no acepta UTMs, así que los clics se miden con un redirect interno:

- `GET /go/whatsapp?src=X` (`src/app/go/whatsapp/route.ts`): registra una fila en `link_click_events` (modelo `LinkClickEvent`: `target: "whatsapp"`, `src`) y hace 302 a `getCommunityUrl()`. Si el registro falla, el redirect **nunca** se bloquea.

## Resúmenes en /admin/usuarios

`src/app/(admin)/admin/usuarios/page.tsx` muestra dos tarjetas:

- **Registros por fuente**: `getSignupAttributionSummary()` (`src/lib/services/admin-content.ts`) — `groupBy utmSource` sobre `users`, con porcentaje sobre el total. `null` se muestra como "Directo / sin fuente".
- **Clics al canal de WhatsApp por fuente**: `getWhatsappClickSummary()` — `groupBy src` sobre `link_click_events` con `target: "whatsapp"`.

La tabla de usuarios incluye además la columna **Fuente** (`utmSource`) por usuario.

## Archivos clave

```text
src/app/bio/page.tsx                        → página pública /bio
src/app/bio/bio-config.ts                   → contenido editable + MUNDIAL_ACTIVO
src/app/bio/open-in-browser-banner.tsx      → aviso in-app browsers
src/lib/attribution.ts                      → helpers puros (+ .test.ts)
src/components/public/attribution-capture.tsx → escribe la cookie en /registro
src/lib/actions/attribution.ts              → Server Action persistAttribution()
src/components/app/attribution-sync.tsx     → dispara la persistencia desde /app
src/lib/auth/index.ts                       → intento best-effort en events.createUser
src/app/go/whatsapp/route.ts                → redirect medible al canal
src/app/(admin)/admin/usuarios/page.tsx     → resúmenes por fuente
prisma/schema.prisma                        → campos UTM en User + LinkClickEvent
```

## Reglas de trabajo

- No mover la persistencia de vuelta a `events.createUser`: `cookies()` no es confiable ahí (esa fue exactamente la razón del diseño actual).
- Mantener la semántica de primer toque: nunca sobreescribir `utmSource` existente.
- Nuevos links medibles sin UTMs → seguir el patrón `/go/*` + `LinkClickEvent` (el modelo ya tiene `target` genérico).
