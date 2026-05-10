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

## Admin

`/admin/programas` y edición de programa permiten:

- Cambiar estado.
- Definir fecha oficial de apertura.
- Definir mensaje de preventa.

## Relación con `isPublished`

`isPublished` sigue existiendo por compatibilidad histórica y por módulos/lecciones.

Para programas, la lógica importante ahora es `status`.

## Cuidado al cambiar

No convertir preventa en “OPEN parcial” sin criterio. Si se abre todo automáticamente en `PRESALE`, se pierde la distinción comercial y de lanzamiento.

