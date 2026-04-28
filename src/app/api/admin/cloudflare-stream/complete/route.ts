import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { isAdminRole } from "@/lib/permissions";

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

  const body = (await request.json().catch(() => null)) as {
    lessonId?: string;
    streamVideoId?: string;
  } | null;

  if (!body?.lessonId || !body.streamVideoId) {
    return NextResponse.json(
      { error: "La lección y el video son requeridos." },
      { status: 400 },
    );
  }

  await prisma.lesson.update({
    where: { id: body.lessonId },
    data: {
      streamVideoId: body.streamVideoId,
      videoStatus: "PROCESSING",
      videoProvider: "Cloudflare Stream",
    },
  });

  return NextResponse.json({ ok: true });
}
