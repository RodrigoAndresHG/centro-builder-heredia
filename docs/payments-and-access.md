# Pagos, Compras Y Accesos

El flujo comercial oficial usa Stripe Checkout.

Archivos clave:

```text
src/app/api/stripe/checkout/route.ts
src/app/api/stripe/webhook/route.ts
src/lib/services/commerce.ts
src/lib/actions/admin-access.ts
src/lib/services/access-control.ts
```

## Flujo oficial de compra

1. Usuario autenticado hace click en comprar/activar acceso.
2. Frontend llama `/api/stripe/checkout`.
3. El route handler valida sesión.
4. `createProductCheckoutSession` busca producto activo.
5. Valida que el producto tenga `stripePriceId`.
6. Valida que al menos un programa asociado esté en `PRESALE` u `OPEN`.
7. Crea sesión Stripe Checkout.
8. Stripe redirige al usuario.
9. Webhook confirma pago.
10. `Purchase` se registra/actualiza.
11. `Access` se crea/activa.
12. Usuario queda listo para consumir según permisos.

## Checkout

`createProductCheckoutSession` usa:

- `mode: "payment"`
- `customer_email`
- `client_reference_id = user.id`
- metadata:
  - `productId`
  - `productSlug`
  - `userId`

Branding actual:

- `branding_settings.display_name = "Rodrigo HeredIA"`
- logo/icon opcionales por File IDs de Stripe si existen:
  - `STRIPE_CHECKOUT_LOGO_FILE_ID`
  - `STRIPE_CHECKOUT_ICON_FILE_ID`

Nota: esas variables opcionales se usan en código. Ver deuda en `known-issues-and-next-steps.md` si no están reflejadas en `.env.example`.

## Webhook

Endpoint:

```text
/api/stripe/webhook
```

Eventos procesados:

- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`

El webhook valida firma con:

```text
STRIPE_WEBHOOK_SECRET
```

## Idempotencia actual

La idempotencia actual se resuelve por:

```prisma
stripeCheckoutSessionId String? @unique
```

`processCheckoutSession` usa `prisma.purchase.upsert` por `stripeCheckoutSessionId`.

Esto fue suficiente para esta fase.

Mejora futura recomendada:

- Guardar y deduplicar por `event.id` de Stripe.
- Crear una tabla tipo `StripeWebhookEvent` o campo equivalente si el volumen/riesgo crece.

Hoy NO está endurecido por `event.id`.

## Access

`Access` determina si el usuario puede abrir contenido premium.

Campos importantes:

- `status`: `ACTIVE` o `INACTIVE`.
- `source`: `STRIPE`, `MANUAL`, `TEST`.
- `startsAt`.
- `expiresAt`.
- `productId`.
- `programId`.

## Origen de acceso

### STRIPE

Acceso comercial real por pago confirmado.

Se asigna automáticamente desde:

```text
src/lib/services/commerce.ts
```

### MANUAL

Acceso creado por admin para habilitación excepcional.

No reemplaza compra oficial.

### TEST

Acceso para pruebas o demos.

## Admin de accesos

`/admin/accesos/nuevo`:

- Selecciona usuario existente.
- Selecciona producto o programa.
- Define estado.
- Define origen `MANUAL` o `TEST`.
- Define fechas.

Regla importante:

```text
Nuevo acceso NO reemplaza Stripe.
```

## Promoción de rol

Cuando un acceso queda `ACTIVE`, si el usuario no es admin, puede pasar a `USUARIO_PAGO`.

Esto se hace para simplificar estado visible de usuario, pero el permiso real depende de `Access`.

## Permisos reales

Archivo:

```text
src/lib/services/access-control.ts
```

Reglas:

- Admin siempre puede abrir.
- Programa sin producto asociado es abierto para usuario autenticado.
- Programa con producto requiere `Access` activo al producto o al programa.
- `Access` debe estar activo por fecha:
  - `startsAt <= now`
  - `expiresAt` nulo o futuro.

## Riesgos a cuidar

- No crear links públicos directos a Stripe como flujo principal sin revisar identidad de usuario.
- No confundir `roleKey` con `Access.source`.
- No hacer bypass solo en UI; validar permisos del lado servidor.
- No modificar webhook sin probar firma real.

