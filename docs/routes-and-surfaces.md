# Rutas Y Superficies

Este documento lista las rutas principales y su propósito actual.

## Público

```text
/
```

Home pública. Posiciona Builder como LMS oficial, presenta el primer programa y dirige a compra, exploración o acceso prioritario.

```text
/programas/build-ideacash
```

Página pública dedicada al programa Build IdeaCash — Founder Access.

```text
/login
/registro
```

Pantallas premium de entrada. Google es el método principal. El correo puede estar disponible si SMTP está configurado.

```text
/acceso-confirmado
```

Pantalla de confirmación para magic link por correo.

## Workspace de usuario

Todas requieren sesión.

```text
/app
```

Dashboard privado. Cambia según acceso:

- Sin acceso: showroom premium del ecosistema Builder.
- Con acceso: continuidad, progreso y siguiente paso.

```text
/app/programas
```

Mapa del ecosistema Builder. Muestra programa destacado y próximos recorridos.

```text
/app/programas/[programSlug]
```

Mapa de un programa. Aplica permisos, preventa, progreso y módulos.

```text
/app/programas/[programSlug]/modulos/[moduleSlug]
```

Vista de módulo. Lista lecciones y estado de acceso/preview.

```text
/app/programas/[programSlug]/lecciones/[lessonSlug]
```

Vista de lección. Reproduce video si existe, muestra contenido, progreso y navegación anterior/siguiente.

```text
/app/updates
/app/updates/[id]
```

Novedades Builder. El listado tiene filtros, destacada, grid compacto y paginación. El detalle muestra contenido completo.

```text
/app/perfil
```

Claridad de cuenta: identidad, email, estado de acceso y ayuda si compró pero no ve acceso.

```text
/app/soporte
```

Centro de ayuda v1 con FAQs, contacto por mailto y CTAs contextuales.

## Admin

Todas requieren rol admin.

```text
/admin
```

Dashboard administrativo.

```text
/admin/programas
/admin/programas/nuevo
/admin/programas/[id]
```

CRUD de programas. Incluye estado comercial `DRAFT`, `PRESALE`, `OPEN`, fecha `opensAt` y mensaje de preventa.

```text
/admin/modulos
/admin/modulos/nuevo
/admin/modulos/[id]
```

CRUD de módulos.

```text
/admin/lecciones
/admin/lecciones/nueva
/admin/lecciones/[id]
```

CRUD de lecciones. El video se gestiona desde la lección.

```text
/admin/videos
```

Biblioteca/índice operativo de videos asociados a lecciones. No es el punto principal de carga.

```text
/admin/updates
/admin/updates/nuevo
/admin/updates/[id]
```

CRUD de Novedades Builder.

```text
/admin/usuarios
```

Resumen maestro de cuentas reales del LMS.

```text
/admin/accesos
/admin/accesos/nuevo
/admin/accesos/[id]
```

Gestión de accesos. `Nuevo acceso` es manual/test y no reemplaza Stripe.

```text
/admin/early-access
```

Vista histórica de leads de acceso temprano. La ruta existe, pero salió del sidebar admin porque ya no es superficie operativa principal.

## API routes

```text
/api/auth/[...nextauth]
```

Auth.js handlers.

```text
/api/stripe/checkout
```

Crea sesión Stripe Checkout para usuario autenticado.

```text
/api/stripe/webhook
```

Procesa eventos Stripe y activa acceso.

```text
/api/admin/cloudflare-stream/direct-upload
```

Crea URL de direct upload de Cloudflare Stream para una lección.

```text
/api/admin/cloudflare-stream/complete
```

Marca una lección con `streamVideoId` y estado `PROCESSING`.

```text
/api/early-access
```

Captura leads históricos de acceso temprano.

```text
/api/health
```

Health check básico.

