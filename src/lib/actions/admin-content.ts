"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { isAdminRole } from "@/lib/permissions";

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

export async function createProgram(formData: FormData) {
  await requireAdmin();

  const title = requireField(readOptionalString(formData, "title"), "Titulo");
  const slug = requireField(readOptionalString(formData, "slug"), "Slug");
  const productId = readOptionalString(formData, "productId");

  const program = await prisma.program.create({
    data: {
      productId,
      title,
      slug,
      description: readOptionalString(formData, "description"),
      isPublished: readBoolean(formData, "isPublished"),
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

  await prisma.program.update({
    where: { id },
    data: {
      productId,
      title,
      slug,
      description: readOptionalString(formData, "description"),
      isPublished: readBoolean(formData, "isPublished"),
    },
  });

  revalidateContentPaths();
  redirect("/admin/programas");
}

export async function toggleProgramPublished(id: string, isPublished: boolean) {
  await requireAdmin();

  await prisma.program.update({
    where: { id },
    data: { isPublished },
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

async function resolveLessonProgramId(programId: string, moduleId: string) {
  const programModule = await prisma.module.findUnique({
    where: { id: moduleId },
    select: { programId: true },
  });

  if (!programModule) {
    throw new Error("Modulo no encontrado.");
  }

  if (programModule.programId !== programId) {
    throw new Error("El modulo seleccionado no pertenece al programa.");
  }

  return programModule.programId;
}

export async function createLesson(formData: FormData) {
  await requireAdmin();

  const programId = requireField(
    readOptionalString(formData, "programId"),
    "Programa",
  );
  const moduleId = requireField(readOptionalString(formData, "moduleId"), "Modulo");
  const title = requireField(readOptionalString(formData, "title"), "Titulo");
  const slug = requireField(readOptionalString(formData, "slug"), "Slug");

  await resolveLessonProgramId(programId, moduleId);

  const lesson = await prisma.lesson.create({
    data: {
      programId,
      moduleId,
      title,
      slug,
      description: readOptionalString(formData, "description"),
      content: readOptionalString(formData, "content"),
      videoUrl: readOptionalString(formData, "videoUrl"),
      sortOrder: readSortOrder(formData),
      isPublished: readBoolean(formData, "isPublished"),
    },
  });

  revalidateContentPaths();
  redirect(`/admin/lecciones/${lesson.id}`);
}

export async function updateLesson(id: string, formData: FormData) {
  await requireAdmin();

  const programId = requireField(
    readOptionalString(formData, "programId"),
    "Programa",
  );
  const moduleId = requireField(readOptionalString(formData, "moduleId"), "Modulo");
  const title = requireField(readOptionalString(formData, "title"), "Titulo");
  const slug = requireField(readOptionalString(formData, "slug"), "Slug");

  await resolveLessonProgramId(programId, moduleId);

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
