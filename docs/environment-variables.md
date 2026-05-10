# Variables De Entorno

Archivo base:

```text
.env.example
```

## Base de datos

```text
DATABASE_URL
```

PostgreSQL. En producción apunta a Neon.

## Auth

```text
AUTH_SECRET
AUTH_URL
```

`AUTH_URL` debe ser:

- Local: `http://localhost:3000`
- Producción: dominio real de Builder.

## Google OAuth

```text
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
```

Callback:

```text
/api/auth/callback/google
```

## Email opcional

```text
EMAIL_SERVER
EMAIL_FROM
```

Si faltan, el provider Nodemailer no se registra.

## Apple placeholder

```text
APPLE_CLIENT_ID
APPLE_CLIENT_SECRET
```

Actualmente preparado como placeholder, no como flujo activo principal.

## Stripe

```text
STRIPE_SECRET_KEY
STRIPE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_IDEACASH_PRICE_ID
```

Opcionales usados por código para branding visual de Checkout:

```text
STRIPE_CHECKOUT_LOGO_FILE_ID
STRIPE_CHECKOUT_ICON_FILE_ID
```

Si no existen, Checkout mantiene display name pero no logo/icon custom.

## Cloudflare Stream

```text
CLOUDFLARE_ACCOUNT_ID
CLOUDFLARE_STREAM_TOKEN
CLOUDFLARE_STREAM_REQUIRE_SIGNED_URLS
```

Estado recomendado actual:

```text
CLOUDFLARE_STREAM_REQUIRE_SIGNED_URLS=false
```

No activar en true hasta implementar signed playback.

## Seed

```text
SEED_ADMIN_EMAIL
SEED_ACCESS_EMAIL
```

`SEED_ADMIN_EMAIL` crea/promueve admin.

`SEED_ACCESS_EMAIL` crea usuario de prueba con acceso.

## Checklist para nueva máquina

1. Copiar `.env.example` a `.env`.
2. Configurar `DATABASE_URL`.
3. Configurar Auth.
4. Configurar Google.
5. Configurar Stripe si se probará compra.
6. Configurar Cloudflare si se probará video.
7. Ejecutar migraciones.
8. Ejecutar seed.

## Cuidado con secretos

Nunca commitear `.env`.

Si se rota un secreto:

- Actualizar Vercel.
- Actualizar entorno local.
- Validar flujo afectado.

