import { prisma } from "@/lib/db/prisma";

export async function listPublishedPromptAssets() {
  return prisma.promptAsset.findMany({
    where: { isPublished: true },
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
  });
}

export async function listAdminPromptAssets() {
  return prisma.promptAsset.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
  });
}

export async function getAdminPromptAsset(id: string) {
  return prisma.promptAsset.findUnique({
    where: { id },
  });
}
