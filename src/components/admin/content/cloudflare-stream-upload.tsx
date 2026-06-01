"use client";

import { useRef, useState } from "react";
import * as tus from "tus-js-client";

type CloudflareStreamUploadProps = {
  lessonId?: string | null;
  lessonTitle?: string | null;
  streamVideoId?: string | null;
  videoStatus?: string | null;
};

// 50MB chunks. Cloudflare Stream's TUS implementation requires chunks
// of multiples of 256 KiB; 50MB (52,428,800 bytes) is safely aligned
// and a good balance between throughput and recovery granularity.
const CHUNK_SIZE = 50 * 1024 * 1024;

export function CloudflareStreamUpload({
  lessonId,
  lessonTitle,
  streamVideoId,
  videoStatus,
}: CloudflareStreamUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function uploadVideo() {
    const file = fileInputRef.current?.files?.[0];

    if (!lessonId) {
      setError("Guarda la lección antes de subir el video.");
      return;
    }

    if (!file) {
      setError("Selecciona un archivo de video.");
      return;
    }

    setIsUploading(true);
    setProgress(0);
    setMessage(null);
    setError(null);

    let directUpload: {
      uploadUrl?: string;
      streamVideoId?: string;
      error?: string;
    } | null = null;

    try {
      const directUploadResponse = await fetch(
        "/api/admin/cloudflare-stream/direct-upload",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            lessonId,
            title: lessonTitle,
          }),
        },
      );
      directUpload = (await directUploadResponse.json().catch(() => null)) as {
        uploadUrl?: string;
        streamVideoId?: string;
        error?: string;
      } | null;

      if (!directUploadResponse.ok || !directUpload?.uploadUrl) {
        throw new Error(
          directUpload?.error ?? "No se pudo preparar la subida del video.",
        );
      }
    } catch (prepareError) {
      setError(
        prepareError instanceof Error
          ? prepareError.message
          : "No se pudo preparar la subida del video.",
      );
      setIsUploading(false);
      return;
    }

    const uploadUrl = directUpload.uploadUrl;
    const uploadedStreamVideoId = directUpload.streamVideoId;

    // TUS resumable upload — handles files of any size, retries on
    // network errors, and reports progress per chunk.
    await new Promise<void>((resolve) => {
      const upload = new tus.Upload(file, {
        uploadUrl,
        chunkSize: CHUNK_SIZE,
        retryDelays: [0, 3000, 6000, 12000, 24000],
        metadata: {
          name: file.name,
          filetype: file.type || "video/mp4",
        },
        onError(uploadError) {
          setError(
            uploadError instanceof Error
              ? `Error en la subida: ${uploadError.message}`
              : "Error desconocido durante la subida.",
          );
          setIsUploading(false);
          resolve();
        },
        onProgress(bytesUploaded, bytesTotal) {
          const percent = Math.round((bytesUploaded / bytesTotal) * 100);
          setProgress(percent);
        },
        async onSuccess() {
          try {
            await fetch("/api/admin/cloudflare-stream/complete", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                lessonId,
                streamVideoId: uploadedStreamVideoId,
              }),
            });

            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }

            setProgress(100);
            setMessage(
              "Video subido a Cloudflare Stream. Puede tardar unos minutos en procesarse. Click en 'Refrescar estado' en /admin/videos cuando termine.",
            );
          } catch (completeError) {
            setError(
              completeError instanceof Error
                ? `Subida OK pero falló el registro: ${completeError.message}`
                : "Subida OK pero falló el registro en la base de datos.",
            );
          } finally {
            setIsUploading(false);
            resolve();
          }
        },
      });

      upload.start();
    });
  }

  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">
            Subida oficial a Cloudflare Stream
          </p>
          <p className="mt-1 text-sm leading-6 text-neutral-500">
            Sube el archivo desde esta lección. Soporta archivos grandes
            (hasta 30GB) con upload resumable: si se cae la conexión, retoma
            desde donde quedó.
          </p>
        </div>
        <span className="w-fit rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-700">
          {videoStatus ?? "NONE"}
        </span>
      </div>

      {streamVideoId ? (
        <p className="mt-3 break-all text-xs font-semibold text-neutral-500">
          Stream ID: {streamVideoId}
        </p>
      ) : null}

      <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center">
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          disabled={!lessonId || isUploading}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={uploadVideo}
          disabled={!lessonId || isUploading}
          className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isUploading ? `Subiendo ${progress}%` : "Subir a Stream"}
        </button>
      </div>

      {isUploading ? (
        <div className="mt-3">
          <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200">
            <div
              className="h-full bg-accent transition-[width] duration-200"
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          <p className="mt-2 text-xs text-neutral-500">
            No cierres esta pestaña. Si se cae internet, el upload reintentará
            automáticamente.
          </p>
        </div>
      ) : null}

      {!lessonId ? (
        <p className="mt-3 text-sm text-neutral-500">
          Primero crea la lección. Luego vuelve a editarla para subir el video.
        </p>
      ) : null}
      {message ? <p className="mt-3 text-sm text-emerald-700">{message}</p> : null}
      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
