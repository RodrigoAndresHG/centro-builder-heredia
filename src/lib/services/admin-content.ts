import { prisma } from "@/lib/db/prisma";

export async function listAdminProducts() {
  return prisma.product.findMany({
    orderBy: { name: "asc" },
  });
}

export async function listAdminPrograms() {
  return prisma.program.findMany({
    orderBy: [{ createdAt: "desc" }],
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
    },
  });
}

export async function listAdminModules() {
  return prisma.module.findMany({
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
    },
  });
}

export async function listAdminLessons() {
  return prisma.lesson.findMany({
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
      videoUrl: {
        not: null,
      },
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

export async function getAdminLesson(id: string) {
  return prisma.lesson.findUnique({
    where: { id },
    include: {
      program: true,
      module: true,
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
