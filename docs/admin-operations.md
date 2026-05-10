# Operación Admin

El admin vive bajo `/admin` y requiere rol `ADMIN`.

## Navegación actual

Sidebar admin actual:

- Dashboard
- Programas
- Módulos
- Lecciones
- Videos
- Novedades
- Usuarios
- Accesos

`Early Access` salió del sidebar, pero la ruta `/admin/early-access` existe como histórico.

## Programas

Rutas:

```text
/admin/programas
/admin/programas/nuevo
/admin/programas/[id]
```

Operaciones:

- Crear programa.
- Editar programa.
- Asociar producto.
- Definir estado `DRAFT`, `PRESALE`, `OPEN`.
- Definir `opensAt`.
- Definir `presaleMessage`.

## Módulos

Rutas:

```text
/admin/modulos
/admin/modulos/nuevo
/admin/modulos/[id]
```

Operaciones:

- Crear módulo.
- Asociarlo a programa.
- Editar slug, título, descripción, orden.
- Publicar/despublicar.

## Lecciones

Rutas:

```text
/admin/lecciones
/admin/lecciones/nueva
/admin/lecciones/[id]
```

Operaciones:

- Crear lección.
- Asociar a módulo.
- Editar contenido.
- Editar video.
- Marcar como preview.
- Publicar/despublicar.

Regla operativa:

```text
El programa guardado de una lección se toma desde el módulo seleccionado.
```

Esto evita inconsistencias entre `programId` y `moduleId`.

## Slug de lecciones

El slug es único por programa:

```prisma
@@unique([programId, slug])
```

`createLesson` y `updateLesson`:

- Normalizan slug.
- Validan duplicados reales.
- En update excluyen la lección actual.

## Videos

Ruta:

```text
/admin/videos
```

Funciona como biblioteca/índice operativo. No es el punto principal de carga.

Para cargar video:

```text
Lecciones -> Editar lección -> Subida oficial a Cloudflare Stream
```

## Novedades

Rutas:

```text
/admin/updates
/admin/updates/nuevo
/admin/updates/[id]
```

Permite:

- Crear publicación.
- Editar publicación.
- Elegir tipo.
- Publicar/despublicar.
- Definir imagen opcional.

## Usuarios

Ruta:

```text
/admin/usuarios
```

Es resumen maestro de cuentas reales del LMS. No es CRM.

Muestra información útil para:

- Ver cuenta.
- Rol.
- Accesos.
- Compras.

## Accesos

Rutas:

```text
/admin/accesos
/admin/accesos/nuevo
/admin/accesos/[id]
```

`Nuevo acceso`:

- Solo usuarios existentes.
- Producto o programa, no ambos.
- Estado.
- Fechas.
- Origen `MANUAL` o `TEST`.

No reemplaza Stripe.

El listado muestra origen:

- Pago confirmado.
- Acceso manual.
- Acceso de prueba.

## Early Access

Ruta:

```text
/admin/early-access
```

Estado actual:

- Existe como histórico.
- No está en sidebar.
- No es operación principal actual.
- No borrar modelo ni datos sin decisión explícita.

## Checklist antes de operar contenido

1. Producto creado y activo.
2. Programa asociado al producto.
3. Programa en `PRESALE` u `OPEN` según fase.
4. Módulos creados y publicados si deben verse.
5. Lecciones creadas, ordenadas y publicadas.
6. Videos subidos desde lección.
7. Si preventa: marcar previews con `isPreview`.
8. Probar como usuario sin acceso.
9. Probar como usuario con acceso.
10. Probar como admin.

