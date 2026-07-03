import { prisma } from "@/lib/db/prisma";
import {
  getCloudflareStreamVideo,
  normalizeStreamVideoStatus,
} from "@/lib/services/cloudflare-stream";

export async function listAdminProducts() {
  return prisma.product.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { programs: true, accesses: true, purchases: true },
      },
    },
  });
}

export async function getAdminProduct(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      programs: {
        orderBy: { createdAt: "asc" },
        select: { id: true, title: true, slug: true, status: true },
      },
      _count: {
        select: { accesses: true, purchases: true },
      },
    },
  });
}

export async function listAdminPrograms() {
  return prisma.program.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    include: {
      product: true,
      modules: true,
      lessons: true,
    },
  });
}

export async function getAdminProgram(id: string) {
  return prisma.program.findUnique({
    where: { id },
    include: {
      product: true,
      modules: {
        orderBy: { sortOrder: "asc" },
      },
      lessons: {
        orderBy: { sortOrder: "asc" },
      },
      _count: {
        select: { modules: true, lessons: true, accesses: true },
      },
    },
  });
}

export async function listAdminModules(programId?: string) {
  return prisma.module.findMany({
    where: programId ? { programId } : undefined,
    orderBy: [{ program: { title: "asc" } }, { sortOrder: "asc" }],
    include: {
      program: true,
      lessons: true,
    },
  });
}

export async function getAdminModule(id: string) {
  return prisma.module.findUnique({
    where: { id },
    include: {
      program: true,
      lessons: {
        orderBy: { sortOrder: "asc" },
      },
      _count: {
        select: { lessons: true },
      },
    },
  });
}

export async function listAdminLessons(programId?: string) {
  return prisma.lesson.findMany({
    where: programId ? { programId } : undefined,
    orderBy: [
      { program: { title: "asc" } },
      { module: { sortOrder: "asc" } },
      { sortOrder: "asc" },
    ],
    include: {
      program: true,
      module: true,
    },
  });
}

export async function listAdminVideoLessons() {
  return prisma.lesson.findMany({
    where: {
      OR: [
        {
          streamVideoId: {
            not: null,
          },
        },
        {
          videoUrl: {
            not: null,
          },
        },
      ],
    },
    orderBy: [
      { program: { title: "asc" } },
      { module: { sortOrder: "asc" } },
      { sortOrder: "asc" },
    ],
    include: {
      program: true,
      module: true,
    },
  });
}

export async function syncAdminStreamVideos() {
  const lessons = await prisma.lesson.findMany({
    where: {
      streamVideoId: {
        not: null,
      },
    },
    select: {
      id: true,
      streamVideoId: true,
    },
  });

  await Promise.all(
    lessons.map(async (lesson) => {
      if (!lesson.streamVideoId) {
        return;
      }

      try {
        const video = await getCloudflareStreamVideo(lesson.streamVideoId);

        await prisma.lesson.update({
          where: { id: lesson.id },
          data: {
            videoStatus: normalizeStreamVideoStatus(video),
            videoThumbnailUrl: video?.thumbnail ?? undefined,
            videoDuration: video?.duration ? Math.round(video.duration) : undefined,
          },
        });
      } catch (error) {
        console.error(
          `[cloudflare-stream] Failed to sync lesson ${lesson.id} (streamVideoId=${lesson.streamVideoId}):`,
          error instanceof Error ? error.message : error,
        );
        await prisma.lesson.update({
          where: { id: lesson.id },
          data: {
            videoStatus: "STATUS_UNAVAILABLE",
          },
        });
      }
    }),
  );
}

export async function listAdminUsers() {
  return prisma.user.findMany({
    orderBy: [{ createdAt: "desc" }],
    include: {
      accounts: true,
      accesses: {
        include: {
          product: true,
          program: true,
        },
      },
      purchases: true,
    },
  });
}

// Registros agrupados por fuente de atribución (utm_source), de mayor a menor.
// El grupo con source=null es intencional: son los registros sin fuente
// (tráfico directo). La UI lo muestra como "Directo / sin fuente".
export async function getSignupAttributionSummary() {
  const rows = await prisma.user.groupBy({
    by: ["utmSource"],
    _count: { _all: true },
  });

  return rows
    .map((row) => ({ source: row.utmSource, count: row._count._all }))
    .sort((a, b) => b.count - a.count);
}

// Clics al canal de WhatsApp agrupados por fuente (vía /go/whatsapp).
export async function getWhatsappClickSummary() {
  const rows = await prisma.linkClickEvent.groupBy({
    by: ["src"],
    where: { target: "whatsapp" },
    _count: { _all: true },
  });

  return rows
    .map((row) => ({ src: row.src, count: row._count._all }))
    .sort((a, b) => b.count - a.count);
}

export async function getAdminLesson(id: string) {
  return prisma.lesson.findUnique({
    where: { id },
    include: {
      program: true,
      module: true,
      prompts: { orderBy: { sortOrder: "asc" } },
      resources: { orderBy: { sortOrder: "asc" } },
    },
  });
}

export async function listProgramOptions() {
  return prisma.program.findMany({
    orderBy: { title: "asc" },
    select: {
      id: true,
      title: true,
      slug: true,
      isPublished: true,
      status: true,
    },
  });
}

export async function listModuleOptions() {
  return prisma.module.findMany({
    orderBy: [{ program: { title: "asc" } }, { sortOrder: "asc" }],
    include: {
      program: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
}
