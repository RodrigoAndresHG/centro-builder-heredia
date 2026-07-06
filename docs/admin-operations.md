# Operación Admin

El admin vive bajo `/admin` y requiere rol `ADMIN`.

## Navegación actual

Sidebar admin actual:

- Dashboard
- Productos
- Programas
- Módulos
- Lecciones
- Videos
- Biblioteca
- Novedades
- Usuarios
- Accesos

`Early Access` salió del sidebar, pero la ruta `/admin/early-access` existe como histórico.

## Productos

Rutas:

```text
/admin/productos
/admin/productos/nuevo
/admin/productos/[id]
```

Operaciones:

- Crear producto.
- Editar producto (slug, nombre, descripción).
- Asociar `stripePriceId` (Stripe Price ID del producto, campo opcional en el modelo `Product`).
- Activar/desactivar (`isActive`).

El producto es la unidad comercial: los programas se asocian a un producto y Stripe cobra contra su `stripePriceId`.

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
- Definir orden de aparición (`sortOrder`).

Borrado de programa:

- En `/admin/programas/[id]` la acción `deleteProgram` exige escribir el slug exacto del programa (`confirmSlug`) antes de borrar.
- El borrado cascada elimina módulos, lecciones, prompts, recursos, progreso y accesos.
- Las compras (`Purchase`) se conservan (queda `productId = null`) para no perder historial comercial.

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
- Filtrar el listado por programa con `?program=<programId>`.

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
- Filtrar el listado por programa con `?program=<programId>`.

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

## Prompts y recursos por lección

Cada lección puede tener material adjunto editable desde su formulario:

- `LessonPrompt`: prompts copiables por lección. Campos: `title`, `body`, `sortOrder`. Relación con `Lesson` con borrado en cascada.
- `LessonResource`: recursos por lección. Campos: `title`, `description` opcional, `url`, `type` (enum `LINK`, `DOWNLOAD`, `REFERENCE`) y `sortOrder`.

Ambos se muestran al usuario dentro de la vista de la lección.

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

La subida usa TUS reanudable (`tus-js-client`) con chunks de 50 MB y reintentos automáticos ante errores de red. Ver detalle en `docs/cloudflare-stream.md`.

## Biblioteca

Rutas:

```text
/admin/biblioteca
/admin/biblioteca/nuevo
/admin/biblioteca/[id]
```

CRUD de prompts reutilizables (modelo `PromptAsset`) que alimentan la Biblioteca de Prompts del usuario en `/app/biblioteca`:

- `title`, `description` opcional, `body`.
- `platform`: `CLAUDE`, `CHATGPT`, `GEMINI` o `MULTI`.
- `category`.
- `isPremium`: el prompt premium se desbloquea con cualquier programa de pago; sin acceso, el `body` se vacía server-side.
- `isPublished` y `sortOrder`.

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
- `Registro`: fecha y hora de registro en zona horaria de Ecuador.
- `Entrada`: proveedor de acceso (Google, Correo, Sin proveedor).
- `Fuente`: atribución de marketing (`utm_source` + `utm_campaign`).

Arriba del listado hay dos resúmenes de atribución:

- Registros por fuente (con porcentaje sobre el total).
- Clics a WhatsApp (desde el redirect medible `/go/whatsapp?src=`).

Borrado de usuario:

- `DeleteUserControl` exige escribir el correo exacto del usuario (o su ID si no tiene correo) antes de habilitar el botón.
- Avisa cuántas compras y accesos activos se borrarán: al eliminar un usuario, sus compras y accesos se eliminan a propósito.
- No puedes eliminar tu propia cuenta.

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

