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

export async function listPublishedBuilderUpdates() {
  return prisma.builderUpdate.findMany({
    where: {
      isPublished: true,
    },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });
}
