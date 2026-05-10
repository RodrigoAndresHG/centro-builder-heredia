# Flujos Críticos

Este documento resume los recorridos que deben probarse antes de desplegar cambios sensibles.

## 1. Login con Google

Archivos:

```text
src/lib/auth/index.ts
src/app/api/auth/[...nextauth]/route.ts
src/proxy.ts
src/app/(public)/login/page.tsx
src/app/(public)/registro/page.tsx
```

Flujo:

1. Usuario entra a `/login` o `/registro`.
2. Hace click en continuar con Google.
3. Auth.js crea/actualiza `User` y `Account`.
4. Se crea `Session` en DB.
5. Callback agrega `id` y `role` a la sesión.
6. Usuario vuelve al callback o a `/app`.

Validar:

- `User.email` existe.
- `Session` se crea.
- `/app` abre.
- `/admin` redirige si no es admin.

## 2. Compra oficial por Stripe

Archivos:

```text
src/app/api/stripe/checkout/route.ts
src/app/api/stripe/webhook/route.ts
src/lib/services/commerce.ts
```

Flujo:

1. Usuario autenticado presiona comprar/activar acceso.
2. `/api/stripe/checkout` valida sesión.
3. Se busca `Product` activo.
4. Se valida `stripePriceId`.
5. Se valida que el producto tenga programa `PRESALE` u `OPEN`.
6. Stripe crea checkout.
7. Webhook recibe confirmación.
8. `Purchase` se crea/actualiza por `stripeCheckoutSessionId`.
9. `Access` se activa con `source = STRIPE`.
10. Usuario queda como `USUARIO_PAGO` si no es admin.

Validar:

- Checkout abre.
- Webhook firma correctamente.
- `Purchase.status = PAID`.
- `Access.status = ACTIVE`.
- `Access.source = STRIPE`.
- `/app` muestra dashboard de usuario con acceso.

## 3. Acceso manual admin

Archivos:

```text
src/app/(admin)/admin/accesos/nuevo/page.tsx
src/components/admin/access/access-form.tsx
src/lib/actions/admin-access.ts
```

Flujo:

1. Admin entra a `/admin/accesos/nuevo`.
2. Selecciona usuario existente.
3. Selecciona producto o programa.
4. Elige `MANUAL` o `TEST`.
5. Define estado y fechas.
6. Se crea `Access`.

Validar:

- No crea usuarios nuevos.
- Bloquea duplicados por usuario/producto o usuario/programa.
- No permite seleccionar producto y programa a la vez.
- No confunde con Stripe.

## 4. Crear contenido

Archivos:

```text
src/lib/actions/admin-content.ts
src/components/admin/content/content-forms.tsx
```

Flujo:

1. Crear programa.
2. Crear módulo asociado a programa.
3. Crear lección asociada a módulo.
4. Publicar lo necesario.
5. Subir video desde la lección.

Regla:

```text
Programa -> Módulo -> Lección -> Video
```

Validar:

- Slug de módulo único por programa.
- Slug de lección único por programa.
- La lección deriva `programId` desde el módulo.
- Video queda en la lección.

## 5. Preventa

Archivos:

```text
src/lib/services/learning.ts
src/lib/services/commerce.ts
src/app/(user)/app/programas/[programSlug]/page.tsx
```

Flujo:

1. Admin define programa como `PRESALE`.
2. Producto sigue comprable.
3. Usuario compra.
4. Usuario con acceso entra al programa.
5. Ve bloque premium de preventa.
6. Mapa visible.
7. Lecciones no preview quedan bloqueadas hasta apertura.

Validar:

- `DRAFT` no aparece.
- `PRESALE` aparece y permite compra.
- `OPEN` consume normalmente.
- `isPreview` abre lección en preventa.

## 6. Cloudflare Stream

Archivos:

```text
src/app/api/admin/cloudflare-stream/direct-upload/route.ts
src/app/api/admin/cloudflare-stream/complete/route.ts
src/lib/services/cloudflare-stream.ts
src/components/admin/content/cloudflare-stream-upload.tsx
```

Flujo:

1. Admin edita lección.
2. Solicita direct upload.
3. Backend pide URL a Cloudflare.
4. DB guarda `streamVideoId` y estado `UPLOADING`.
5. Browser sube archivo.
6. Frontend avisa complete.
7. DB pasa a `PROCESSING`.
8. Usuario con acceso reproduce iframe si hay `streamVideoId`.

Validar:

- Token Cloudflare no llega al browser.
- Video se carga desde lección.
- `CLOUDFLARE_STREAM_REQUIRE_SIGNED_URLS=false` en fase actual.

## 7. Progreso de lección

Archivos:

```text
src/lib/actions/progress.ts
src/lib/services/progress.ts
```

Flujo:

1. Usuario abre lección con acceso permitido.
2. Marca completada.
3. `LessonProgress` se upsertea por `userId + lessonId`.
4. Dashboard/programa/módulo recalculan progreso.

Validar:

- Usuario sin acceso no puede marcar.
- La siguiente lección se calcula correctamente.

## 8. Novedades Builder

Archivos:

```text
src/lib/services/builder-updates.ts
src/app/(admin)/admin/updates
src/app/(user)/app/updates
```

Flujo:

1. Admin crea novedad.
2. Publica.
3. Usuario ve feed.
4. Filtro por categoría funciona.
5. Detalle `/app/updates/[id]` muestra contenido completo.

Validar:

- Solo se muestran `isPublished = true`.
- Paginación funciona.
- No se muestra contenido largo en listado.

