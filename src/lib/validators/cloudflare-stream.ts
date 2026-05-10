import { z } from "zod";

export const directUploadRequestSchema = z.object({
  lessonId: z.string().min(1, "La lección es requerida para subir video."),
  title: z.string().trim().min(1).optional(),
});

export type DirectUploadRequest = z.infer<typeof directUploadRequestSchema>;

export const completeUploadRequestSchema = z.object({
  lessonId: z.string().min(1, "La lección es requerida."),
  streamVideoId: z.string().min(1, "El video es requerido."),
});

export type CompleteUploadRequest = z.infer<typeof completeUploadRequestSchema>;
