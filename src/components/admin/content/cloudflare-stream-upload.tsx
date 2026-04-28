"use client";

import { useRef, useState } from "react";

type CloudflareStreamUploadProps = {
  lessonId?: string | null;
  lessonTitle?: string | null;
  streamVideoId?: string | null;
  videoStatus?: string | null;
};

export function CloudflareStreamUpload({
  lessonId,
  lessonTitle,
  streamVideoId,
  videoStatus,
}: CloudflareStreamUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
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
    setMessage(null);
    setError(null);

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
      const directUpload = (await directUploadResponse
        .json()
        .catch(() => null)) as {
        uploadUrl?: string;
        streamVideoId?: string;
        error?: string;
      } | null;

      if (!directUploadResponse.ok || !directUpload?.uploadUrl) {
        throw new Error(
          directUpload?.error ?? "No se pudo preparar la subida del video.",
        );
      }

      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await fetch(directUpload.uploadUrl, {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Cloudflare no aceptó el archivo de video.");
      }

      await fetch("/api/admin/cloudflare-stream/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lessonId,
          streamVideoId: directUpload.streamVideoId,
        }),
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setMessage(
        "Video enviado a Cloudflare Stream. Puede tardar unos minutos en procesarse.",
      );
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "No se pudo subir el video.",
      );
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">
            Subida oficial a Cloudflare Stream
          </p>
          <p className="mt-1 text-sm leading-6 text-neutral-500">
            Sube el archivo desde esta lección. El token de Cloudflare nunca se
            expone al navegador.
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
          {isUploading ? "Subiendo..." : "Subir a Stream"}
        </button>
      </div>

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
