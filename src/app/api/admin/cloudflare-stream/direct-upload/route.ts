import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { isAdminRole } from "@/lib/permissions";
import { createCloudflareStreamDirectUpload } from "@/lib/services";
import { directUploadRequestSchema } from "@/lib/validators";

async function requireAdmin() {
  const session = await auth();

  if (!session?.user || !isAdminRole(session.user.role)) {
    return false;
  }

  return true;
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const rawBody = await request.json().catch(() => null);
  const parsed = directUploadRequestSchema.safeParse(rawBody);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error:
          parsed.error.issues[0]?.message ??
          "La lección es requerida para subir video.",
      },
      { status: 400 },
    );
  }

  const lesson = await prisma.lesson.findUnique({
    where: { id: parsed.data.lessonId },
    select: { id: true, title: true },
  });

  if (!lesson) {
    return NextResponse.json(
      { error: "Lección no encontrada." },
      { status: 404 },
    );
  }

  const videoTitle = parsed.data.title ?? lesson.title;

  try {
    const directUpload = await createCloudflareStreamDirectUpload({
      lessonId: lesson.id,
      title: videoTitle,
    });

    await prisma.lesson.update({
      where: { id: lesson.id },
      data: {
        streamVideoId: directUpload.uid,
        videoStatus: "UPLOADING",
        videoProvider: "Cloudflare Stream",
        videoTitle,
        videoUrl: null,
      },
    });

    return NextResponse.json({
      streamVideoId: directUpload.uid,
      uploadUrl: directUpload.uploadURL,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se pudo iniciar la subida a Cloudflare Stream.",
      },
      { status: 500 },
    );
  }
}
