# Drip de onboarding por email (5 correos / 7 días)

Secuencia automática de bienvenida: 5 correos en 7 días (días 0, 1, 3, 5 y 7 desde el registro), enviados vía Resend y orquestados por un cron diario de Vercel. Diseñada para ser idempotente, serverless-safe y con baja de un clic (RFC 8058).

## Contenido y cadencia

`src/lib/email/onboarding-emails.ts`:

- `SEQUENCE_LENGTH = 5`, `SEQUENCE_DAY_OFFSETS = [0, 1, 3, 5, 7]`.
- El copy de los 5 correos vive en el array `EMAILS` y es exactamente el aprobado (E1 bienvenida → E2 idea Multi-IA → E3 historia/error → E4 pitch Agente de Noticias → E5 Builder Multi-IA).
- `renderOnboardingEmail(step, { baseUrl, unsubscribeToken })` devuelve `{ subject, html }` con CTA y link de baja en el pie.

## Modelo

```prisma
model EmailSequenceState {
  userId            // @unique → un estado por usuario
  email
  step              // índice del PRÓXIMO correo a enviar (0..5); al llegar a 5 → done
  status            // enum EmailSequenceStatus: pending | done | unsubscribed | failed
  attempts          // fallos de envío del correo ACTUAL (máx 3)
  nextSendAt
  lastSentAt
  unsubscribeToken  // @unique, 48 hex chars
}
```

Tabla: `email_sequence_state`, índice `[status, nextSendAt]`.

## Inscripción (idempotente)

`enrollUserInOnboarding(userId, email)` en `src/lib/services/email-sequence.ts`, llamada desde `events.createUser` de Auth.js (`src/lib/auth/index.ts`), en su propio try/catch para no bloquear el registro:

- `upsert` con `update: {}` → si el usuario ya tiene estado, no lo duplica ni lo reinicia.
- El correo 1 queda con `nextSendAt = now`, así sale en la próxima corrida del cron.
- Este módulo es LIGERO a propósito (no importa Resend) para no arrastrar el SDK al bundle del auth.

Las fechas se anclan al `createdAt` de la inscripción (`computeNextSendAt`), sin drift acumulado.

## Cron

- Endpoint: `GET /api/cron/email-sequence` (`src/app/api/cron/email-sequence/route.ts`), runtime Node, `maxDuration = 60`.
- Programado en `vercel.json`: diario a las **14:00 UTC** (`"0 14 * * *"`).
- Auth: Vercel Cron manda `Authorization: Bearer ${CRON_SECRET}`; el endpoint compara en tiempo constante (`timingSafeEqual`). Sin `CRON_SECRET` configurado, rechaza todo. El mismo header sirve para invocarlo a mano en dev.

## Corrida (`runOnboardingSequence`)

`src/lib/email/run-sequence.ts`:

1. Exige configuración (`RESEND_API_KEY` + `EMAIL_FROM`, vía `isEmailSequenceConfigured` en `src/lib/email/config.ts`); si falta, lanza.
2. Busca hasta 100 filas con `status in (pending, failed)`, `nextSendAt <= now` y `attempts < 3`.
3. **Claim atómico por fila** (`updateMany` condicionado a step/status/nextSendAt): si otra corrida solapada ya la tomó, se salta. El claim empuja `nextSendAt` 6 h al futuro mientras se envía.
4. Envía con Resend y, si sale bien, avanza `step`, reprograma `nextSendAt` (o marca `done` al terminar los 5) y resetea `attempts` a 0.
5. Si falla el envío: `status = failed`, `attempts + 1`, `nextSendAt = now` → se reintenta el MISMO correo en la próxima corrida. Tras `MAX_ATTEMPTS = 3` fallos deja de reintentarse (evita martillar un correo inválido y dañar la reputación del dominio).

## Resend

`src/lib/email/resend.ts` (`sendEmail`):

- `idempotencyKey: onboarding-<stateId>-step-<step>` → idempotencia real en Resend: si un reintento repite el mismo correo, no se entrega dos veces.
- Headers `List-Unsubscribe: <url>` y `List-Unsubscribe-Post: List-Unsubscribe=One-Click` → baja de un clic desde Gmail/Outlook/Apple Mail (RFC 8058) y mejor deliverability.
- La URL base de los links sale de `getAppBaseUrl()` (reusa `AUTH_URL`; cae a `https://builder.rodriheredia.com`).

## Baja (/unsubscribe)

Dos caminos, ambos sobre `unsubscribeByToken(token)` (marca `status = unsubscribed`, idempotente):

- **`POST /api/unsubscribe?token=...`** (`src/app/api/unsubscribe/route.ts`): one-click RFC 8058, lo llaman los clientes de correo directamente. Devuelve 200 aunque el token no exista (no revelar validez). Un `GET` a ese endpoint redirige a la página.
- **`/unsubscribe?token=...`** (`src/app/unsubscribe/page.tsx`): página con botón de confirmación — la baja solo se procesa con el POST del Server Action, no al abrir el link (evita que un escáner de correo dé de baja por prefetch). `robots: noindex`, `referrer: no-referrer` para no filtrar el token.

## Variables de entorno

| Env | Rol |
| --- | --- |
| `RESEND_API_KEY` | API key de Resend (obligatoria para enviar). |
| `EMAIL_FROM` | Remitente verificado (compartida con el magic link de Auth.js). |
| `CRON_SECRET` | Autoriza el cron; Vercel la inyecta como Bearer. |
| `AUTH_URL` | Base absoluta para los links de los correos. |

## Archivos clave

```text
src/lib/email/onboarding-emails.ts       → copy, cadencia y render (+ .test.ts)
src/lib/email/run-sequence.ts            → corrida del drip (claims, reintentos)
src/lib/email/resend.ts                  → envío vía Resend
src/lib/email/config.ts                  → getAppBaseUrl / isEmailSequenceConfigured
src/lib/services/email-sequence.ts       → enrolamiento, transiciones, baja (+ .test.ts)
src/app/api/cron/email-sequence/route.ts → endpoint del cron
src/app/api/unsubscribe/route.ts         → one-click RFC 8058
src/app/unsubscribe/page.tsx             → página de baja con confirmación
vercel.json                              → schedule del cron
```

## Reglas de trabajo

- No cambiar el copy de los correos sin aprobación: es el texto exacto aprobado.
- No quitar el claim atómico ni la `idempotencyKey`: son lo que hace seguro un cron que se solape o reintente.
- La baja jamás debe procesarse en un GET de página (prefetch de escáneres).
