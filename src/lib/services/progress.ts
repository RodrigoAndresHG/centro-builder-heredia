import { prisma } from "@/lib/db/prisma";

type LessonProgressLesson = {
  id: string;
  slug: string;
  title: string;
  sortOrder: number;
};

type LessonProgressModule = {
  id: string;
  slug: string;
  title: string;
  lessons: LessonProgressLesson[];
};

type LessonProgressProgram = {
  slug: string;
  modules: LessonProgressModule[];
};

export type NextLessonTarget = {
  href: string;
  lesson: LessonProgressLesson;
  module: LessonProgressModule;
};

export function flattenProgramLessons(program: LessonProgressProgram) {
  return program.modules.flatMap((module) =>
    module.lessons.map((lesson) => ({
      lesson,
      module,
      href: `/app/programas/${program.slug}/lecciones/${lesson.slug}`,
    })),
  );
}

export async function getCompletedLessonIds(userId: string, lessonIds: string[]) {
  if (lessonIds.length === 0) {
    return new Set<string>();
  }

  const rows = await prisma.lessonProgress.findMany({
    where: {
      userId,
      lessonId: {
        in: lessonIds,
      },
    },
    select: {
      lessonId: true,
    },
  });

  return new Set(rows.map((row) => row.lessonId));
}

export async function getProgramProgress(
  userId: string,
  program: LessonProgressProgram,
) {
  const lessons = flattenProgramLessons(program);
  const completedLessonIds = await getCompletedLessonIds(
    userId,
    lessons.map(({ lesson }) => lesson.id),
  );
  const completedCount = lessons.filter(({ lesson }) =>
    completedLessonIds.has(lesson.id),
  ).length;
  const totalCount = lessons.length;
  const percent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const nextLesson =
    lessons.find(({ lesson }) => !completedLessonIds.has(lesson.id)) ??
    lessons.at(-1) ??
    null;

  return {
    completedLessonIds,
    completedCount,
    totalCount,
    percent,
    nextLesson,
    isComplete: totalCount > 0 && completedCount === totalCount,
  };
}

export function getModuleProgress(
  module: LessonProgressModule,
  completedLessonIds: Set<string>,
) {
  const totalCount = module.lessons.length;
  const completedCount = module.lessons.filter((lesson) =>
    completedLessonIds.has(lesson.id),
  ).length;
  const percent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const nextLesson = module.lessons.find(
    (lesson) => !completedLessonIds.has(lesson.id),
  ) ?? module.lessons.at(-1) ?? null;

  return {
    completedCount,
    totalCount,
    percent,
    nextLesson,
    isComplete: totalCount > 0 && completedCount === totalCount,
  };
}

export async function isLessonCompleted(userId: string, lessonId: string) {
  const progress = await prisma.lessonProgress.findUnique({
    where: {
      userId_lessonId: {
        userId,
        lessonId,
      },
    },
    select: {
      id: true,
    },
  });

  return Boolean(progress);
}

export async function markLessonCompleted(userId: string, lessonId: string) {
  return prisma.lessonProgress.upsert({
    where: {
      userId_lessonId: {
        userId,
        lessonId,
      },
    },
    update: {
      completedAt: new Date(),
    },
    create: {
      userId,
      lessonId,
    },
  });
}
