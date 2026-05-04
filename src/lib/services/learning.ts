import { prisma } from "@/lib/db/prisma";
import type { Prisma } from "@/generated/prisma/client";
import {
  canViewerOpenProgram,
  type AccessDecision,
  type LearningViewer,
} from "@/lib/services/access-control";

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
} satisfies Prisma.ProgramInclude;

const publishedProgramWhere = {
  status: {
    in: ["PRESALE", "OPEN"] as const,
  },
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
} satisfies Prisma.ProgramWhereInput;

export async function listPublishedPrograms() {
  return prisma.program.findMany({
    where: publishedProgramWhere,
    orderBy: { createdAt: "asc" },
    include: programInclude,
  });
}

export async function listProgramsForViewer(viewer: LearningViewer) {
  const programs = await listPublishedPrograms();
  const decisions = await Promise.all(
    programs.map(async (program) => ({
      program,
      access: (await canViewerOpenProgram(viewer, program))
        ? ("allowed" as const)
        : ("locked" as const),
    })),
  );

  return {
    availablePrograms: decisions
      .filter((decision) => decision.access === "allowed")
      .map((decision) => decision.program),
    lockedPrograms: decisions
      .filter((decision) => decision.access === "locked")
      .map((decision) => decision.program),
  };
}

export async function getPrimaryProgram(viewer: LearningViewer) {
  const { availablePrograms } = await listProgramsForViewer(viewer);

  return availablePrograms[0] ?? null;
}

async function getPublishedProgramBySlug(programSlug: string) {
  return prisma.program.findFirst({
    where: {
      slug: programSlug,
      ...publishedProgramWhere,
    },
    include: programInclude,
  });
}

export async function getProgramBySlug(
  programSlug: string,
  viewer: LearningViewer,
) {
  const program = await getPublishedProgramBySlug(programSlug);

  if (!program) {
    return {
      access: "not-found" as const,
      program: null,
    };
  }

  const canOpen = await canViewerOpenProgram(viewer, program);

  return {
    access: canOpen ? ("allowed" as const) : ("locked" as const),
    program,
  };
}

export async function getModuleBySlug(
  programSlug: string,
  moduleSlug: string,
  viewer: LearningViewer,
) {
  const programResult = await getProgramBySlug(programSlug, viewer);

  if (programResult.access !== "allowed" || !programResult.program) {
    return {
      access: programResult.access,
      program: programResult.program,
      module: null,
    };
  }

  const programModule =
    programResult.program.modules.find((module) => module.slug === moduleSlug) ??
    null;

  return {
    access: (programModule ? "allowed" : "not-found") as
      | AccessDecision
      | "not-found",
    program: programResult.program,
    module: programModule,
  };
}

export async function getLessonBySlug(
  programSlug: string,
  lessonSlug: string,
  viewer: LearningViewer,
) {
  const programResult = await getProgramBySlug(programSlug, viewer);

  if (programResult.access !== "allowed" || !programResult.program) {
    return {
      access: programResult.access,
      program: programResult.program,
      lesson: null,
      previousLesson: null,
      nextLesson: null,
    };
  }

  const lessons = programResult.program.modules.flatMap((module) =>
    module.lessons.map((lesson) => ({
      ...lesson,
      moduleSlug: module.slug,
      moduleTitle: module.title,
    })),
  );
  const currentIndex = lessons.findIndex((lesson) => lesson.slug === lessonSlug);

  if (currentIndex < 0) {
    return {
      access: "not-found" as const,
      program: programResult.program,
      lesson: null,
      previousLesson: null,
      nextLesson: null,
    };
  }

  return {
    access: "allowed" as const,
    program: programResult.program,
    lesson: lessons[currentIndex],
    previousLesson: lessons[currentIndex - 1] ?? null,
    nextLesson: lessons[currentIndex + 1] ?? null,
  };
}

export function getProgramLessonCount(
  program:
    | Awaited<ReturnType<typeof listPublishedPrograms>>[number]
    | NonNullable<Awaited<ReturnType<typeof getPublishedProgramBySlug>>>
    | null,
) {
  return program?.modules.reduce(
    (total, module) => total + module.lessons.length,
    0,
  ) ?? 0;
}
