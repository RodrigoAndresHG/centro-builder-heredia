import { prisma } from "@/lib/db/prisma";

const programInclude = {
  product: true,
  modules: {
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" as const },
    include: {
      lessons: {
        where: { isPublished: true },
        orderBy: { sortOrder: "asc" as const },
      },
    },
  },
};

export async function listVisiblePrograms() {
  return prisma.program.findMany({
    where: {
      isPublished: true,
      OR: [
        { productId: null },
        {
          product: {
            is: {
              isActive: true,
            },
          },
        },
      ],
    },
    orderBy: { createdAt: "asc" },
    include: programInclude,
  });
}

export async function getPrimaryProgram() {
  const programs = await listVisiblePrograms();

  return programs[0] ?? null;
}

export async function getProgramBySlug(programSlug: string) {
  return prisma.program.findFirst({
    where: {
      slug: programSlug,
      isPublished: true,
      OR: [
        { productId: null },
        {
          product: {
            is: {
              isActive: true,
            },
          },
        },
      ],
    },
    include: programInclude,
  });
}

export async function getModuleBySlug(programSlug: string, moduleSlug: string) {
  return prisma.module.findFirst({
    where: {
      slug: moduleSlug,
      isPublished: true,
      program: {
        slug: programSlug,
        isPublished: true,
        OR: [
          { productId: null },
          {
            product: {
              is: {
                isActive: true,
              },
            },
          },
        ],
      },
    },
    include: {
      program: {
        include: {
          product: true,
        },
      },
      lessons: {
        where: { isPublished: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });
}

export async function getLessonBySlug(programSlug: string, lessonSlug: string) {
  const program = await getProgramBySlug(programSlug);

  if (!program) {
    return null;
  }

  const lessons = program.modules.flatMap((module) =>
    module.lessons.map((lesson) => ({
      ...lesson,
      moduleSlug: module.slug,
      moduleTitle: module.title,
    })),
  );
  const currentIndex = lessons.findIndex((lesson) => lesson.slug === lessonSlug);

  if (currentIndex < 0) {
    return null;
  }

  return {
    program,
    lesson: lessons[currentIndex],
    previousLesson: lessons[currentIndex - 1] ?? null,
    nextLesson: lessons[currentIndex + 1] ?? null,
  };
}

export function getProgramLessonCount(
  program: Awaited<ReturnType<typeof getProgramBySlug>>,
) {
  return program?.modules.reduce(
    (total, module) => total + module.lessons.length,
    0,
  ) ?? 0;
}
