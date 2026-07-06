# Biblioteca de Prompts

La Biblioteca de Prompts es un catálogo real de prompts copiables dentro del LMS, con capa gratuita y capa premium. Vive en `/app/biblioteca` para el usuario y en `/admin/biblioteca` para gestión.

## Modelo

```prisma
model PromptAsset {
  id
  title
  description   // opcional
  body          // @db.Text, el prompt en sí
  platform      // PromptPlatform: CLAUDE | CHATGPT | GEMINI | MULTI (default MULTI)
  category      // texto libre, ej: "Marketing", "Código"
  isPremium     // default false
  isPublished   // default false
  sortOrder     // default 0
  createdAt
  updatedAt
}
```

Tabla: `prompt_assets`. Índices por `[isPublished, platform]` y `[category]`.

Validación de entrada en `src/lib/validators/prompt-asset.ts` (`promptAssetInputSchema`): título máx 200, categoría máx 60, descripción máx 500 (se normaliza a `null` si viene vacía), body mín 1 / máx 20.000 caracteres, plataforma dentro del enum.

## Premium vs gratis

- Un prompt con `isPremium = false` es visible completo para cualquier usuario autenticado.
- Un prompt con `isPremium = true` se desbloquea con **cualquier programa de pago**: la condición real es rol `USUARIO_PAGO` o rol admin (`isAdminRole`). No hay gating por producto individual.

## Seguridad server-side del body

Regla crítica: **el cuerpo de un prompt premium nunca viaja al cliente si el usuario no tiene acceso**. No es un candado visual.

En `src/app/(user)/app/biblioteca/page.tsx` (Server Component):

```ts
const canSeePremium = user.role === "USUARIO_PAGO" || isAdminRole(user.role);

const locked = asset.isPremium && !canSeePremium;
body: locked ? "" : asset.body,
```

El componente cliente `PromptLibrary` recibe `body: ""` y `locked: true` para los prompts bloqueados; renderiza el estado bloqueado sin conocer el contenido. Inspeccionar el HTML o el payload de React no revela nada.

Además, la página redirige a `/login?callbackUrl=/app/biblioteca` si no hay sesión.

## Consultas (servicios)

`src/lib/services/prompt-assets.ts`:

- `listPublishedPromptAssets()`: solo `isPublished: true`, orden `category → sortOrder → createdAt`. Es lo que consume `/app/biblioteca`.
- `listAdminPromptAssets()`: todo, mismo orden. Para el listado admin.
- `getAdminPromptAsset(id)`: detalle para edición.

## Admin

Rutas:

```text
/admin/biblioteca
/admin/biblioteca/nuevo
/admin/biblioteca/[id]
```

Server Actions en `src/lib/actions/admin-content.ts`:

- `createPromptAsset(formData)`
- `updatePromptAsset(id, formData)`
- `togglePromptAssetPublished(id, ...)`
- `deletePromptAsset(id)`

Todas parsean el formulario con `promptAssetInputSchema` vía `parsePromptAssetFormData`.

## Archivos clave

```text
prisma/schema.prisma                          → modelo PromptAsset
src/lib/validators/prompt-asset.ts            → schema de entrada (+ .test.ts)
src/lib/services/prompt-assets.ts             → consultas
src/lib/actions/admin-content.ts              → CRUD admin
src/app/(user)/app/biblioteca/page.tsx        → vista usuario + vaciado server-side
src/components/app/prompt-library.tsx         → UI cliente (búsqueda, categorías, copiar)
src/app/(admin)/admin/biblioteca/             → páginas admin
```

## Reglas de trabajo

- No mover el filtro `isPremium` al cliente: el vaciado del `body` debe seguir ocurriendo en el Server Component.
- No confundir el gating de la biblioteca (por rol) con `Access` por programa: aquí basta ser `USUARIO_PAGO`.
- Los `LessonPrompt` (prompts por lección) son otro modelo distinto; no compartir tablas ni UI.
