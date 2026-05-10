# Cloudflare Stream

Cloudflare Stream es el proveedor oficial de video para Builder.

## Arquitectura aprobada

```text
Programa -> Módulo -> Lección -> Video en Cloudflare Stream ligado a la lección
```

El archivo vive en Cloudflare Stream. La base de datos guarda metadata y relación con la lección.

## Archivos clave

```text
src/lib/services/cloudflare-stream.ts
src/app/api/admin/cloudflare-stream/direct-upload/route.ts
src/app/api/admin/cloudflare-stream/complete/route.ts
src/components/admin/content/cloudflare-stream-upload.tsx
src/components/admin/content/content-forms.tsx
src/app/(admin)/admin/videos/page.tsx
src/app/(user)/app/programas/[programSlug]/lecciones/[lessonSlug]/page.tsx
```

## Variables

```text
CLOUDFLARE_ACCOUNT_ID
CLOUDFLARE_STREAM_TOKEN
CLOUDFLARE_STREAM_REQUIRE_SIGNED_URLS
```

Estado actual esperado:

```text
CLOUDFLARE_STREAM_REQUIRE_SIGNED_URLS=false
```

## Flujo de subida

1. Admin entra a editar lección.
2. Usa componente de subida Cloudflare.
3. Frontend llama `/api/admin/cloudflare-stream/direct-upload`.
4. Backend valida admin.
5. Backend pide URL direct upload a Cloudflare.
6. Backend guarda:
   - `streamVideoId`
   - `videoStatus = UPLOADING`
   - `videoProvider = Cloudflare Stream`
   - `videoTitle`
   - `videoUrl = null`
7. Browser sube archivo directo a Cloudflare usando `uploadURL`.
8. Frontend llama `/api/admin/cloudflare-stream/complete`.
9. Backend marca:
   - `videoStatus = PROCESSING`
   - `videoProvider = Cloudflare Stream`

## Metadata en Lesson

Campos:

- `streamVideoId`
- `videoStatus`
- `videoTitle`
- `videoThumbnailUrl`
- `videoDuration`
- `videoProvider`
- `isPreview`

`streamVideoId` es único.

## Reproducción actual

La reproducción usa iframe público:

```ts
https://iframe.videodelivery.net/${streamVideoId}
```

Helper:

```text
getCloudflareStreamPlaybackUrl
```

## Signed URLs

Respuesta explícita:

- Hoy NO se activan signed URLs.
- `CLOUDFLARE_STREAM_REQUIRE_SIGNED_URLS=false`.
- El playback actual usa iframe público.
- Signed URLs quedan como siguiente fase de hardening.
- No es prioridad inmediata mientras el foco siga en operación/lanzamiento.

Advertencia:

Si se cambia `CLOUDFLARE_STREAM_REQUIRE_SIGNED_URLS=true`, los nuevos uploads pueden exigir reproducción firmada. El sistema actual no genera tokens firmados para playback, por lo que se debe implementar esa capa antes de activar la opción.

## Biblioteca `/admin/videos`

No es el punto principal de carga.

Sirve para:

- Revisar videos vinculados a lecciones.
- Ver estado.
- Localizar lecciones con video.
- Ir a editar la lección.

## Qué NO está implementado todavía

- Signed playback.
- URLs temporales por usuario.
- Restricción criptográfica por `Access`.
- Webhooks de Cloudflare Stream.
- Polling automático robusto de estado.
- Player custom avanzado.

## Hardening futuro

1. Activar signed URLs.
2. Generar tokens server-side por usuario autorizado.
3. Expirar URLs.
4. Integrar webhook de Cloudflare para actualizar `videoStatus`.
5. Auditar que usuarios sin acceso no puedan obtener URLs firmadas.

