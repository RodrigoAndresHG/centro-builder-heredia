# Preventa Y Estado De Programa

Builder soporta vender un programa antes de abrir el recorrido completo.

## Modelo

`Program` tiene:

```prisma
status ProgramStatus @default(DRAFT)
opensAt DateTime?
presaleMessage String?
```

Estados:

```prisma
enum ProgramStatus {
  DRAFT
  PRESALE
  OPEN
}
```

## Significado

### DRAFT

- No visible al usuario final.
- No comprable si el producto solo tiene programas draft.
- Solo admin lo ve.

### PRESALE

- Visible.
- Comprable.
- Acceso comercial puede activarse.
- Recorrido completo todavía no abierto.
- Usuario premium ve mensaje premium de preventa.
- Puede mostrar mapa, módulos, lecciones y previews.

### OPEN

- Visible.
- Comprable.
- Consumible normalmente.

## Visibilidad

El servicio de aprendizaje usa:

```ts
status: { in: ["PRESALE", "OPEN"] }
```

Esto vive en:

```text
src/lib/services/learning.ts
```

## Compra en preventa

Stripe permite compra si el producto está activo y tiene al menos un programa asociado con status:

- `PRESALE`
- `OPEN`

Esto evita vender productos cuyo contenido esté totalmente `DRAFT`.

## UX de preventa

En `/app/programas/[programSlug]`, si `status === "PRESALE"` y el usuario tiene acceso:

- Ve bloque premium: “Ya estás dentro de la preventa”.
- Ve `presaleMessage` o copy fallback.
- Ve `opensAt`.
- Ve cronómetro.

Componente:

```text
src/components/app/presale-countdown.tsx
```

## Consumo durante preventa

Regla actual:

- Programa se puede ver.
- Módulos se pueden listar.
- Lecciones se pueden listar.
- Lecciones completas no se abren automáticamente.
- Lecciones con `isPreview = true` pueden consumirse.

El objetivo es que el usuario sienta que ya está dentro temprano, no que el sistema está incompleto.

Nota técnica: los módulos y lecciones devueltos siempre vienen filtrados por su programa (relación FK) y por `isPublished = true` en el `include` del query (`programInclude` en `src/lib/services/learning.ts`). La visibilidad de preventa opera a nivel de programa, no de módulo/lección individual.

## Admin

`/admin/programas` y edición de programa permiten:

- Cambiar estado.
- Definir fecha oficial de apertura.
- Definir mensaje de preventa.
- Definir `sortOrder`: orden de visualización (entero). Programas con `sortOrder` menor aparecen primero en `/app/programas`.

## Relación con el Admin de Productos

Un programa comprable debe estar asociado a un producto activo con `stripePriceId` configurado (ver `payments-and-access.md`). Los cambios de estado del programa afectan la compra en Stripe: si el producto solo tiene programas `DRAFT`, el checkout se rechaza. La asociación programa ↔ producto se gestiona en `/admin/programas`.

## Relación con `isPublished`

`isPublished` sigue existiendo por compatibilidad histórica y por módulos/lecciones.

Para programas, la lógica importante ahora es `status`.

`Program.sortOrder`: los programas se ordenan por `sortOrder` (entero, default 0) en la UI (`listPublishedPrograms` ordena por `sortOrder: "asc"`). El admin en `/admin/programas` permite establecer este valor; programas con `sortOrder` menor aparecen primero.

## Acceso a programas individuales

Además del acceso a nivel de producto, un usuario puede tener un `Access` directo a un programa (relación `Program.accesses`). Caso de uso: habilitar un solo programa sin que el usuario compre el producto completo. Ver detalle en `payments-and-access.md`.

## Casos extremos de preventa

Si un programa cambia de `OPEN` a `PRESALE` después de lanzar, los accesos existentes NO se revocan: `Access.status` es independiente de `Program.status`. El usuario con acceso pasa a ver la experiencia de preventa (bloqueo de lecciones no preview) mientras el programa esté en `PRESALE`, pero su acceso comercial sigue intacto y vuelve a consumir todo al regresar a `OPEN`.

## Cuidado al cambiar

No convertir preventa en “OPEN parcial” sin criterio. Si se abre todo automáticamente en `PRESALE`, se pierde la distinción comercial y de lanzamiento.

