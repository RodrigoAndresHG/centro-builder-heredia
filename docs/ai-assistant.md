# Asistente Builder (IA)

El Asistente Builder es un chatbot de soporte dentro del LMS. Responde dudas sobre cuentas, accesos, pagos, programas, lecciones, progreso, biblioteca y soporte. No es un asistente general: está deliberadamente acotado a Builder HeredIA.

## Superficies

- **Widget**: `src/components/app/assistant-widget.tsx`, montado en el layout de `/app` (`src/app/(user)/app/layout.tsx`). Burbuja flotante disponible en toda el área de usuario.
- **API**: `POST /api/asistente` (`src/app/api/asistente/route.ts`). Requiere sesión (401 si no hay usuario).

## Modelo y SDK

Lógica en `src/lib/services/assistant.ts`, usando `@anthropic-ai/sdk`:

- Modelo por defecto: `claude-haiku-4-5` (elegido por costo — es un bot de FAQs). Se puede subir vía env `ASSISTANT_MODEL` sin tocar código.
- `max_tokens: 600` — tope deliberado para respuestas cortas y control de costo.
- El system prompt se envía con `cache_control: { type: "ephemeral" }`: hoy está bajo el mínimo cacheable, pero empezará a ahorrar automáticamente cuando el conocimiento crezca.
- `isAssistantConfigured()` exige `ANTHROPIC_API_KEY`; si falta, el endpoint devuelve 503 con mensaje amable (no rompe la UI).

## Límite diario (anti-abuso)

- `ASSISTANT_DAILY_LIMIT = 20` mensajes por usuario y por día.
- El contador vive en la tabla `assistant_usage` (modelo `AssistantUsage`: `userId + day` únicos, `day` como string `YYYY-MM-DD`).
- `consumeAssistantQuota(userId)` hace un `upsert` con `increment` — serverless-safe, el estado está en la DB, no en memoria del proceso.
- Cuota agotada → 429 con mensaje que deriva a soporte.

## Validación de entrada

`src/lib/validators/assistant.ts` (`assistantChatSchema`): el cliente envía el historial completo (`messages`), máximo 12 turnos de máximo 1.500 caracteres cada uno, y el último mensaje debe ser del usuario. Acota costo y abuso antes de tocar la API de Anthropic. Acepta además un `lessonContext` opcional (`programSlug` + `lessonSlug`).

## Contexto de lección (asistente consciente de la lección)

Cuando el usuario abre el widget **dentro de una lección** (`/app/programas/[slug]/lecciones/[slug]`):

- El widget detecta la ruta con `usePathname()` y envía `lessonContext` en cada petición; las preguntas rápidas cambian a modo lección ("Resúmeme esta lección", etc.) y el saludo muestra el chip "Con contexto de esta lección".
- El route handler **re-valida el acceso en el servidor** con `getLessonBySlug(programSlug, lessonSlug, viewer)` Y aplica la misma regla de consumo que la página: en **PRESALE** solo las lecciones `isPreview` son consumibles (`program.status === "OPEN" || lesson.isPreview`). Un `lessonContext` falsificado hacia una lección premium/bloqueada/no-preview se ignora en silencio (el asistente responde sin contexto).
- `buildLessonContextBlock()` (`src/lib/services/assistant.ts`) arma un **segundo bloque de sistema** con programa, módulo, título y contenido de la lección, truncado a 8.000 caracteres (control de costo). Ese bloque lleva su propio `cache_control: ephemeral`: preguntas seguidas sobre la misma lección reutilizan el prefijo cacheado.
- Si la lección no tiene texto (solo video), se le dice al modelo explícitamente para que no invente contenido.

## System prompt

`buildAssistantSystemPrompt()` compone dos bloques:

1. **Conocimiento estático** (`STATIC_KNOWLEDGE` en el mismo archivo): qué es Builder HeredIA, login (Google + magic link), pagos con Stripe, problemas comunes, mapa de `/app`, comunidad (la URL del canal se inyecta con `getCommunityUrl()`).
2. **Programas reales de la DB**: `getProgramsSummary()` consulta programas en estado `PRESALE`/`OPEN` con su producto. Los precios NO viven en la DB (viven en Stripe), así que se mantienen en la tabla `PRODUCT_PRICES` por slug de producto dentro de `assistant.ts` — **actualízala si cambian los precios**.

Reglas del prompt (resumen):

- Español neutro latinoamericano, con "tú".
- Breve: 2-4 frases, directo a la solución.
- Texto plano, sin Markdown (el widget no renderiza Markdown).
- Solo información del documento; si no está, lo dice y deriva a `soporte@rodriheredia.com`.
- Temas fuera del LMS → rechaza amablemente.
- Pagos no reflejados / reembolsos → siempre a soporte, sin prometer nada.
- Nunca pide contraseñas, códigos ni tarjetas; nunca inventa enlaces.

## Manejo de errores del endpoint

- `Anthropic.RateLimitError` → 429 ("muy solicitado").
- `Anthropic.APIError` → 502 (se loguea el status).
- Otro error → 500. En todos los casos el usuario recibe un mensaje amable en español.

## Variables de entorno

| Env | Rol |
| --- | --- |
| `ANTHROPIC_API_KEY` | Obligatoria; sin ella el asistente responde 503. |
| `ASSISTANT_MODEL` | Opcional; sobreescribe `claude-haiku-4-5`. |

## Archivos clave

```text
src/lib/services/assistant.ts           → modelo, conocimiento, quota, llamada a Anthropic
src/app/api/asistente/route.ts          → endpoint POST con auth + quota + errores
src/lib/validators/assistant.ts         → schema del chat (+ .test.ts)
src/components/app/assistant-widget.tsx → UI del chat flotante
prisma/schema.prisma                    → modelo AssistantUsage
```
