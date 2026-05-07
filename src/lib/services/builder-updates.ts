import { prisma } from "@/lib/db/prisma";

export const builderUpdateTypes = [
  { value: "NOVEDAD", label: "Novedad" },
  { value: "TIP", label: "Tip" },
  { value: "IA", label: "IA" },
  { value: "RECOMENDACION", label: "Recomendación" },
] as const;

export type BuilderUpdateTypeValue = (typeof builderUpdateTypes)[number]["value"];

export function getBuilderUpdateTypeLabel(type: string) {
  return (
    builderUpdateTypes.find((updateType) => updateType.value === type)?.label ??
    "Novedad"
  );
}

export function isBuilderUpdateType(value: string): value is BuilderUpdateTypeValue {
  return builderUpdateTypes.some((updateType) => updateType.value === value);
}

type PublishedBuilderUpdateFilters = {
  page?: number;
  pageSize?: number;
  type?: BuilderUpdateTypeValue;
};

export async function listAdminBuilderUpdates() {
  return prisma.builderUpdate.findMany({
    orderBy: [{ createdAt: "desc" }],
  });
}

export async function getAdminBuilderUpdate(id: string) {
  return prisma.builderUpdate.findUnique({
    where: { id },
  });
}

export async function listPublishedBuilderUpdates({
  page = 1,
  pageSize = 7,
  type,
}: PublishedBuilderUpdateFilters = {}) {
  const safePage = Math.max(1, page);
  const where = {
    isPublished: true,
    ...(type ? { type } : {}),
  };
  const [updates, totalCount] = await Promise.all([
    prisma.builderUpdate.findMany({
      where,
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      skip: (safePage - 1) * pageSize,
      take: pageSize,
    }),
    prisma.builderUpdate.count({ where }),
  ]);

  return {
    updates,
    totalCount,
    page: safePage,
    pageSize,
    totalPages: Math.max(1, Math.ceil(totalCount / pageSize)),
  };
}

export async function getPublishedBuilderUpdate(id: string) {
  return prisma.builderUpdate.findFirst({
    where: {
      id,
      isPublished: true,
    },
  });
}
