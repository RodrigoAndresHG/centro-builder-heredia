# Auth Y Sesiones

La autenticación vive en:

```text
src/lib/auth/index.ts
src/app/api/auth/[...nextauth]/route.ts
src/proxy.ts
src/types/next-auth.d.ts
```

## Auth.js / NextAuth

El proyecto usa NextAuth v5 beta con Prisma Adapter.

Providers actuales:

- Google.
- Nodemailer, solo si `EMAIL_SERVER` y `EMAIL_FROM` están configurados.

Páginas custom:

- `signIn`: `/login`
- `verifyRequest`: `/acceso-confirmado`

## Sesiones en base de datos

Decisión explícita:

```ts
session: {
  strategy: "database",
}
```

Esto queda documentado como decisión consciente desde ahora.

Motivos:

- Control operativo de sesiones.
- Posible revocación futura.
- Gobernanza de sesiones si el LMS crece.
- Coherencia con Prisma Adapter y modelos Auth.js.

No migrar a JWT por ahora.

## Callback de sesión

El callback añade:

- `session.user.id`
- `session.user.role`

El rol viene de `user.roleKey`.

## Roles

Roles base:

- `INVITADO`
- `USUARIO_PAGO`
- `ADMIN`

Un usuario nuevo entra como `INVITADO`.

Cuando Stripe activa acceso, si el usuario no es admin, se promueve a `USUARIO_PAGO`.

Importante:

- Rol describe capacidad general de usuario.
- `Access.source` describe origen del acceso.
- No mezclar ambas cosas.

## Protección por proxy

Archivo:

```text
src/proxy.ts
```

Reglas:

- `/app/*`: requiere sesión.
- `/admin/*`: requiere sesión y rol admin.

Si no hay sesión, se redirige a `/login?callbackUrl=...`.

Si hay sesión pero no admin en `/admin`, se redirige a `/app`.

## Google OAuth

Callback local:

```text
http://localhost:3000/api/auth/callback/google
```

En producción debe apuntar al dominio real:

```text
https://builder.rodriheredia.com/api/auth/callback/google
```

## Email provider

El correo es opcional. Si faltan `EMAIL_SERVER` o `EMAIL_FROM`, el provider de Nodemailer no se registra.

No mostrar errores técnicos al usuario final si email no está listo.

## Recomendaciones de mantenimiento

- No cambiar `session.strategy` a JWT sin revisar impacto en `proxy.ts`, callbacks, revocación y admin.
- Mantener `AUTH_SECRET` fuerte.
- Asegurar `AUTH_URL` correcto en producción.
- Revisar expiración/limpieza de sesiones si el sistema crece.

