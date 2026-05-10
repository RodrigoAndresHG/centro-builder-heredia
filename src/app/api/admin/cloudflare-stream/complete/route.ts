import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { isAdminRole } from "@/lib/permissions";
import { completeUploadRequestSchema } from "@/lib/validators";

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
  const parsed = completeUploadRequestSchema.safeParse(rawBody);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error:
          parsed.error.issues[0]?.message ??
          "La lección y el video son requeridos.",
      },
      { status: 400 },
    );
  }

  await prisma.lesson.update({
    where: { id: parsed.data.lessonId },
    data: {
      streamVideoId: parsed.data.streamVideoId,
      videoStatus: "PROCESSING",
      videoProvider: "Cloudflare Stream",
    },
  });

  return NextResponse.json({ ok: true });
}
