"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { isAdminRole } from "@/lib/permissions";
import { isBuilderUpdateType } from "@/lib/services/builder-updates";

async function requireAdmin() {
  const session = await auth();

  if (!session?.user || !isAdminRole(session.user.role)) {
    throw new Error("No autorizado.");
  }
}

function readString(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function readOptionalString(formData: FormData, key: string) {
  const value = readString(formData, key);

  return value.length > 0 ? value : null;
}

function readBoolean(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function readSortOrder(formData: FormData) {
  const rawValue = readString(formData, "sortOrder");
  const parsedValue = Number.parseInt(rawValue, 10);

  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

function readOptionalInt(formData: FormData, key: string) {
  const rawValue = readString(formData, key);

  if (!rawValue) {
    return null;
  }

  const parsedValue = Number.parseInt(rawValue, 10);

  return Number.isFinite(parsedValue) ? parsedValue : null;
}

function readOptionalDate(formData: FormData, key: string) {
  const rawValue = readString(formData, key);

  if (!rawValue) {
    return null;
  }

  const parsedDate = new Date(rawValue);

  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

function readProgramStatus(formData: FormData) {
  const status = readString(formData, "status");

  if (status === "DRAFT" || status === "PRESALE" || status === "OPEN") {
    return status;
  }

  return "DRAFT";
}

function requireField(value: string | null, label: string) {
  if (!value) {
    throw new Error(`${label} es requerido.`);
  }

  return value;
}

function revalidateContentPaths() {
  revalidatePath("/admin", "layout");
  revalidatePath("/app", "layout");
}

function readBuilderUpdateType(formData: FormData) {
  const type = readString(formData, "type");

  return isBuilderUpdateType(type) ? type : "NOVEDAD";
}

export async function createProgram(formData: FormData) {
  await requireAdmin();

  const title = requireField(readOptionalString(formData, "title"), "Titulo");
  const slug = requireField(readOptionalString(formData, "slug"), "Slug");
  const productId = readOptionalString(formData, "productId");
  const status = readProgramStatus(formData);

  const program = await prisma.program.create({
    data: {
      productId,
      title,
      slug,
      description: readOptionalString(formData, "description"),
      status,
      opensAt: readOptionalDate(formData, "opensAt"),
      presaleMessage: readOptionalString(formData, "presaleMessage"),
      isPublished: status !== "DRAFT",
    },
  });

  revalidateContentPaths();
  redirect(`/admin/programas/${program.id}`);
}

export async function updateProgram(id: string, formData: FormData) {
  await requireAdmin();

  const title = requireField(readOptionalString(formData, "title"), "Titulo");
  const slug = requireField(readOptionalString(formData, "slug"), "Slug");
  const productId = readOptionalString(formData, "productId");
  const status = readProgramStatus(formData);

  await prisma.program.update({
    where: { id },
    data: {
      productId,
      title,
      slug,
      description: readOptionalString(formData, "description"),
      status,
      opensAt: readOptionalDate(formData, "opensAt"),
      presaleMessage: readOptionalString(formData, "presaleMessage"),
      isPublished: status !== "DRAFT",
    },
  });

  revalidateContentPaths();
  redirect("/admin/programas");
}

export async function toggleProgramPublished(id: string, isPublished: boolean) {
  await requireAdmin();

  await prisma.program.update({
    where: { id },
    data: {
      isPublished,
      status: isPublished ? "OPEN" : "DRAFT",
    },
  });

  revalidateContentPaths();
}

export async function createModule(formData: FormData) {
  await requireAdmin();

  const programId = requireField(
    readOptionalString(formData, "programId"),
    "Programa",
  );
  const title = requireField(readOptionalString(formData, "title"), "Titulo");
  const slug = requireField(readOptionalString(formData, "slug"), "Slug");

  const programModule = await prisma.module.create({
    data: {
      programId,
      title,
      slug,
      description: readOptionalString(formData, "description"),
      sortOrder: readSortOrder(formData),
      isPublished: readBoolean(formData, "isPublished"),
    },
  });

  revalidateContentPaths();
  redirect(`/admin/modulos/${programModule.id}`);
}

export async function updateModule(id: string, formData: FormData) {
  await requireAdmin();

  const programId = requireField(
    readOptionalString(formData, "programId"),
    "Programa",
  );
  const title = requireField(readOptionalString(formData, "title"), "Titulo");
  const slug = requireField(readOptionalString(formData, "slug"), "Slug");

  await prisma.$transaction([
    prisma.module.update({
      where: { id },
      data: {
        programId,
        title,
        slug,
        description: readOptionalString(formData, "description"),
        sortOrder: readSortOrder(formData),
        isPublished: readBoolean(formData, "isPublished"),
      },
    }),
    prisma.lesson.updateMany({
      where: { moduleId: id },
      data: { programId },
    }),
  ]);

  revalidateContentPaths();
  redirect("/admin/modulos");
}

export async function toggleModulePublished(id: string, isPublished: boolean) {
  await requireAdmin();

  await prisma.module.update({
    where: { id },
    data: { isPublished },
  });

  revalidateContentPaths();
}

async function resolveLessonProgramId(moduleId: string) {
  const programModule = await prisma.module.findUnique({
    where: { id: moduleId },
    select: { programId: true },
  });

  if (!programModule) {
    throw new Error("Modulo no encontrado.");
  }

  return programModule.programId;
}

export async function createLesson(formData: FormData) {
  await requireAdmin();

  const moduleId = requireField(readOptionalString(formData, "moduleId"), "Modulo");
  const title = requireField(readOptionalString(formData, "title"), "Titulo");
  const slug = requireField(readOptionalString(formData, "slug"), "Slug");
  const programId = await resolveLessonProgramId(moduleId);

  const lesson = await prisma.lesson.create({
    data: {
      programId,
      moduleId,
      title,
      slug,
      description: readOptionalString(formData, "description"),
      content: readOptionalString(formData, "content"),
      videoUrl: readOptionalString(formData, "videoUrl"),
      videoProvider: readOptionalString(formData, "videoProvider"),
      videoTitle: readOptionalString(formData, "videoTitle"),
      videoThumbnailUrl: readOptionalString(formData, "videoThumbnailUrl"),
      videoDuration: readOptionalInt(formData, "videoDuration"),
      isPreview: readBoolean(formData, "isPreview"),
      sortOrder: readSortOrder(formData),
      isPublished: readBoolean(formData, "isPublished"),
    },
  });

  revalidateContentPaths();
  redirect(`/admin/lecciones/${lesson.id}`);
}

export async function updateLesson(id: string, formData: FormData) {
  await requireAdmin();

  const moduleId = requireField(readOptionalString(formData, "moduleId"), "Modulo");
  const title = requireField(readOptionalString(formData, "title"), "Titulo");
  const slug = requireField(readOptionalString(formData, "slug"), "Slug");
  const programId = await resolveLessonProgramId(moduleId);

  await prisma.lesson.update({
    where: { id },
    data: {
      programId,
      moduleId,
      title,
      slug,
      description: readOptionalString(formData, "description"),
      content: readOptionalString(formData, "content"),
      videoUrl: readOptionalString(formData, "videoUrl"),
      videoProvider: readOptionalString(formData, "videoProvider"),
      videoTitle: readOptionalString(formData, "videoTitle"),
      videoThumbnailUrl: readOptionalString(formData, "videoThumbnailUrl"),
      videoDuration: readOptionalInt(formData, "videoDuration"),
      isPreview: readBoolean(formData, "isPreview"),
      sortOrder: readSortOrder(formData),
      isPublished: readBoolean(formData, "isPublished"),
    },
  });

  revalidateContentPaths();
  redirect("/admin/lecciones");
}

export async function toggleLessonPublished(id: string, isPublished: boolean) {
  await requireAdmin();

  await prisma.lesson.update({
    where: { id },
    data: { isPublished },
  });

  revalidateContentPaths();
}

export async function createBuilderUpdate(formData: FormData) {
  await requireAdmin();

  const title = requireField(readOptionalString(formData, "title"), "Titulo");
  const summary = requireField(
    readOptionalString(formData, "summary"),
    "Resumen",
  );
  const content = requireField(
    readOptionalString(formData, "content"),
    "Contenido",
  );
  const isPublished = readBoolean(formData, "isPublished");
  const builderUpdate = await prisma.builderUpdate.create({
    data: {
      title,
      type: readBuilderUpdateType(formData),
      summary,
      content,
      imageUrl: readOptionalString(formData, "imageUrl"),
      isPublished,
      publishedAt: isPublished ? new Date() : null,
    },
  });

  revalidateContentPaths();
  redirect(`/admin/updates/${builderUpdate.id}`);
}

export async function updateBuilderUpdate(id: string, formData: FormData) {
  await requireAdmin();

  const title = requireField(readOptionalString(formData, "title"), "Titulo");
  const summary = requireField(
    readOptionalString(formData, "summary"),
    "Resumen",
  );
  const content = requireField(
    readOptionalString(formData, "content"),
    "Contenido",
  );
  const isPublished = readBoolean(formData, "isPublished");
  const currentUpdate = await prisma.builderUpdate.findUnique({
    where: { id },
    select: { publishedAt: true },
  });

  await prisma.builderUpdate.update({
    where: { id },
    data: {
      title,
      type: readBuilderUpdateType(formData),
      summary,
      content,
      imageUrl: readOptionalString(formData, "imageUrl"),
      isPublished,
      publishedAt: isPublished ? (currentUpdate?.publishedAt ?? new Date()) : null,
    },
  });

  revalidateContentPaths();
  redirect("/admin/updates");
}

export async function toggleBuilderUpdatePublished(
  id: string,
  isPublished: boolean,
) {
  await requireAdmin();

  const currentUpdate = await prisma.builderUpdate.findUnique({
    where: { id },
    select: { publishedAt: true },
  });

  await prisma.builderUpdate.update({
    where: { id },
    data: {
      isPublished,
      publishedAt: isPublished ? (currentUpdate?.publishedAt ?? new Date()) : null,
    },
  });

  revalidateContentPaths();
}
