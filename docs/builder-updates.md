# Novedades Builder

Novedades Builder es un sistema real de publicaciones administrables dentro del LMS.

## Modelo

```prisma
model BuilderUpdate {
  id
  title
  type
  summary
  content
  imageUrl
  isPublished
  publishedAt
  createdAt
  updatedAt
}
```

Tipos:

- `NOVEDAD`: cambios del LMS, programa o plataforma.
- `TIP`: consejo práctico.
- `IA`: señal relevante de IA aterrizada a utilidad real.
- `RECOMENDACION`: opinión o sugerencia directa.

## Admin

Rutas:

```text
/admin/updates
/admin/updates/nuevo
/admin/updates/[id]
```

Campos:

- Título.
- Tipo.
- Resumen.
- Contenido.
- Imagen opcional.
- Publicado.

Si una publicación se publica por primera vez, se define `publishedAt`.

## Usuario

Rutas:

```text
/app/updates
/app/updates/[id]
```

El feed actual incluye:

- Hero corto.
- Filtros por categoría.
- Novedad destacada.
- Grid compacto.
- Paginación simple.
- CTA final contextual.

La vista detalle muestra:

- Categoría.
- Fecha.
- Título.
- Resumen.
- Imagen si existe.
- Contenido completo.
- Regreso al feed.

## Filtros

Los filtros usan query param:

```text
/app/updates?type=TIP
/app/updates?type=IA
/app/updates?type=RECOMENDACION
/app/updates?type=NOVEDAD
```

Todas:

```text
/app/updates
```

## Paginación

El servicio `listPublishedBuilderUpdates` acepta:

- `page`
- `pageSize`
- `type`

Por defecto el feed usa `pageSize = 7`.

## Detalle por id

La ruta actual de detalle usa:

```text
/app/updates/[id]
```

No existe slug editorial todavía.

Mejora futura recomendada:

- Agregar `slug` único para URLs más editoriales.
- Mantener fallback por `id` o redirección desde id a slug si se migra.

## Reglas editoriales

No usar como blog genérico. Debe sentirse como:

- Pulso del sistema.
- Criterio útil para construir.
- Señales relevantes de IA aterrizadas a Builder.
- Recomendaciones accionables.

No publicar:

- Noticias IA sin contexto.
- Changelog técnico sin utilidad.
- Texto largo sin resumen escaneable.

