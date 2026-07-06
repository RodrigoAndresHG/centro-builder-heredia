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

## Admin de Productos

Cada `Product` requiere un `stripePriceId` (Price ID obtenido del Stripe Dashboard).

- Sin `stripePriceId`, el checkout falla con `400 El producto no tiene Stripe Price configurado.` (validación en `createProductCheckoutSession`, `src/lib/services/commerce.ts`).
- `/admin/productos` permite crear/editar productos, incluyendo el campo Stripe Price ID.
- Al crear un producto nuevo o cambiar de precio en Stripe, hay que actualizar este campo en el admin antes de vender.

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

`Access` determina si el usuario puede abrir contenido premium. Puede vincularse a un PRODUCTO (acceso a todos los programas del producto) o a un PROGRAMA específico (acceso solo a ese programa).

Campos importantes:

- `status`: `ACTIVE` o `INACTIVE`.
- `source`: `STRIPE`, `MANUAL`, `TEST`.
- `startsAt`.
- `expiresAt`.
- `productId` (opcional).
- `programId` (opcional).

Solo uno de `productId`/`programId` va poblado por acceso. En el schema hay restricciones únicas separadas: `@@unique([userId, productId])` y `@@unique([userId, programId])`.

### Acceso a nivel de Programa

Además del acceso por producto, el sistema soporta acceso directo a un programa individual (`hasActiveProgramAccess` en `src/lib/services/access-control.ts`).

Casos de uso:

- Producto = bundle: acceso por producto abre todos sus programas.
- Acceso modular: habilitar un solo programa sin regalar el producto completo (por ejemplo, cortesía o promoción puntual).

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

Cuando un acceso queda `ACTIVE`, si el usuario no es admin, se promociona automáticamente a `USUARIO_PAGO` (`upgradePaidRoleIfNeeded`, usado tanto en `commerce.ts` como en `admin-access.ts`). No es opcional: siempre ocurre.

Esto se hace para simplificar el estado visible de usuario, pero el permiso real depende de `Access`.

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

Nota de visibilidad: los programas publicados se ordenan en la UI por `Program.sortOrder` (entero, menor primero; ver `listPublishedPrograms` en `src/lib/services/learning.ts`). El orden no afecta permisos, solo presentación.

## Riesgos a cuidar

- No crear links públicos directos a Stripe como flujo principal sin revisar identidad de usuario.
- No confundir `roleKey` con `Access.source`.
- No hacer bypass solo en UI; validar permisos del lado servidor.
- No modificar webhook sin probar firma real.

