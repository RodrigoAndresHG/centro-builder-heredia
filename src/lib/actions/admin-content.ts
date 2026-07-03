"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { isAdminRole } from "@/lib/permissions";
import { syncAdminStreamVideos } from "@/lib/services/admin-content";
import { isBuilderUpdateType } from "@/lib/services/builder-updates";
import {
  getCloudflareStreamVideo,
  normalizeStreamVideoStatus,
} from "@/lib/services/cloudflare-stream";
import {
  associateVideoSchema,
  lessonResourceTypes,
  productInputSchema,
  promptAssetInputSchema,
  promptInputSchema,
  promptPlatforms,
  resourceInputSchema,
  type LessonResourceTypeValue,
  type PromptPlatformValue,
} from "@/lib/validators";

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

function normalizeSlug(value: string | null) {
  const slug = requireField(value, "Slug")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return requireField(slug, "Slug");
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
      sortOrder: readSortOrder(formData),
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
      sortOrder: readSortOrder(formData),
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

export async function deleteProgram(id: string, formData: FormData) {
  await requireAdmin();

  const program = await prisma.program.findUnique({
    where: { id },
    select: { slug: true, _count: { select: { accesses: true } } },
  });

  if (!program) {
    throw new Error("Programa no encontrado.");
  }

  // Typed-slug safeguard: the admin must type the program slug exactly.
  const confirmSlug = readString(formData, "confirmSlug");
  if (confirmSlug !== program.slug) {
    throw new Error(
      `Para eliminar, escribe exactamente el slug del programa: "${program.slug}".`,
    );
  }

  // Cascade deletes modules, lessons, prompts, resources, lesson
  // progress, and accesses (per schema onDelete: Cascade). Purchases
  // are preserved (productId set null) so commercial history survives.
  await prisma.program.delete({ where: { id } });

  revalidateContentPaths();
  redirect("/admin/programas");
}

export async function deleteUser(userId: string, formData: FormData) {
  await requireAdmin();

  const session = await auth();
  if (session?.user?.id === userId) {
    throw new Error("No puedes eliminar tu propia cuenta.");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, roleKey: true },
  });

  if (!user) {
    throw new Error("Usuario no encontrado.");
  }

  if (user.roleKey === "ADMIN") {
    throw new Error("No se puede eliminar una cuenta de administrador.");
  }

  // Salvaguarda: escribir exactamente el correo (o el ID si no tiene correo).
  const expected = user.email?.trim() || userId;
  const confirmValue = readString(formData, "confirmValue");
  if (confirmValue.toLowerCase() !== expected.toLowerCase()) {
    throw new Error(`Para eliminar, escribe exactamente: "${expected}".`);
  }

  // Cascade borra accounts, sessions, accesses, purchases, lessonProgress,
  // assistantUsage y el estado de la secuencia de email (onDelete: Cascade).
  await prisma.user.delete({ where: { id: userId } });

  revalidatePath("/admin/usuarios");
}

export async function deleteModule(id: string) {
  await requireAdmin();

  const programModule = await prisma.module.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!programModule) {
    throw new Error("Modulo no encontrado.");
  }

  // Lessons survive: their moduleId is set to null (onDelete: SetNull),
  // so content is not lost — only the module grouping is removed.
  await prisma.module.delete({ where: { id } });

  revalidateContentPaths();
  redirect("/admin/modulos");
}

export async function deleteLesson(id: string) {
  await requireAdmin();

  const lesson = await prisma.lesson.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!lesson) {
    throw new Error("Leccion no encontrada.");
  }

  // Cascade deletes the lesson's prompts, resources, and progress.
  await prisma.lesson.delete({ where: { id } });

  revalidateContentPaths();
  redirect("/admin/lecciones");
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

async function ensureLessonSlugIsAvailable({
  lessonId,
  programId,
  slug,
}: {
  lessonId?: string;
  programId: string;
  slug: string;
}) {
  const existingLesson = await prisma.lesson.findFirst({
    where: {
      programId,
      slug,
      ...(lessonId
        ? {
            NOT: {
              id: lessonId,
            },
          }
        : {}),
    },
    select: {
      id: true,
      title: true,
    },
  });

  if (existingLesson) {
    throw new Error(
      `Ya existe otra lección con el slug "${slug}" dentro de este programa.`,
    );
  }
}

export async function createLesson(formData: FormData) {
  await requireAdmin();

  const moduleId = requireField(readOptionalString(formData, "moduleId"), "Modulo");
  const title = requireField(readOptionalString(formData, "title"), "Titulo");
  const slug = normalizeSlug(readOptionalString(formData, "slug"));
  const programId = await resolveLessonProgramId(moduleId);

  await ensureLessonSlugIsAvailable({
    programId,
    slug,
  });

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
  const slug = normalizeSlug(readOptionalString(formData, "slug"));
  const programId = await resolveLessonProgramId(moduleId);

  await ensureLessonSlugIsAvailable({
    lessonId: id,
    programId,
    slug,
  });

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

export async function refreshAdminStreamVideos() {
  await requireAdmin();
  await syncAdminStreamVideos();
  revalidatePath("/admin/videos");
}

function parseProductFormData(formData: FormData) {
  const parsed = productInputSchema.safeParse({
    name: readString(formData, "name"),
    slug: normalizeSlug(readOptionalString(formData, "slug")),
    description: readString(formData, "description"),
    stripePriceId: readString(formData, "stripePriceId"),
    isActive: readBoolean(formData, "isActive"),
  });

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ?? "Datos de producto inválidos.",
    );
  }

  return parsed.data;
}

export async function createProduct(formData: FormData) {
  await requireAdmin();
  const data = parseProductFormData(formData);

  const existing = await prisma.product.findUnique({
    where: { slug: data.slug },
    select: { id: true },
  });

  if (existing) {
    throw new Error(
      `Ya existe un producto con el slug "${data.slug}". Elige otro.`,
    );
  }

  const product = await prisma.product.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      stripePriceId: data.stripePriceId,
      isActive: data.isActive,
    },
  });

  revalidateContentPaths();
  redirect(`/admin/productos/${product.id}`);
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAdmin();
  const data = parseProductFormData(formData);

  const existing = await prisma.product.findFirst({
    where: { slug: data.slug, NOT: { id } },
    select: { id: true },
  });

  if (existing) {
    throw new Error(
      `Ya existe otro producto con el slug "${data.slug}". Elige otro.`,
    );
  }

  await prisma.product.update({
    where: { id },
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      stripePriceId: data.stripePriceId,
      isActive: data.isActive,
    },
  });

  revalidateContentPaths();
  redirect("/admin/productos");
}

export async function toggleProductActive(id: string, isActive: boolean) {
  await requireAdmin();

  await prisma.product.update({
    where: { id },
    data: { isActive },
  });

  revalidateContentPaths();
}

function parsePromptFormData(formData: FormData) {
  const parsed = promptInputSchema.safeParse({
    title: readString(formData, "title"),
    body: readString(formData, "body"),
    sortOrder: readSortOrder(formData),
  });

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ?? "Datos del prompt inválidos.",
    );
  }

  return parsed.data;
}

function isLessonResourceType(value: string): value is LessonResourceTypeValue {
  return (lessonResourceTypes as readonly string[]).includes(value);
}

function parseResourceFormData(formData: FormData) {
  const rawType = readString(formData, "type");
  const parsed = resourceInputSchema.safeParse({
    title: readString(formData, "title"),
    description: readString(formData, "description"),
    url: readString(formData, "url"),
    type: isLessonResourceType(rawType) ? rawType : "LINK",
    sortOrder: readSortOrder(formData),
  });

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ?? "Datos del recurso inválidos.",
    );
  }

  return parsed.data;
}

async function ensureLessonExists(lessonId: string) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: { id: true },
  });

  if (!lesson) {
    throw new Error("Lección no encontrada.");
  }
}

export async function createLessonPrompt(lessonId: string, formData: FormData) {
  await requireAdmin();
  await ensureLessonExists(lessonId);
  const data = parsePromptFormData(formData);

  await prisma.lessonPrompt.create({
    data: {
      lessonId,
      title: data.title,
      body: data.body,
      sortOrder: data.sortOrder,
    },
  });

  revalidateContentPaths();
}

export async function updateLessonPrompt(promptId: string, formData: FormData) {
  await requireAdmin();
  const data = parsePromptFormData(formData);

  await prisma.lessonPrompt.update({
    where: { id: promptId },
    data: {
      title: data.title,
      body: data.body,
      sortOrder: data.sortOrder,
    },
  });

  revalidateContentPaths();
}

export async function deleteLessonPrompt(promptId: string) {
  await requireAdmin();

  await prisma.lessonPrompt.delete({
    where: { id: promptId },
  });

  revalidateContentPaths();
}

export async function createLessonResource(
  lessonId: string,
  formData: FormData,
) {
  await requireAdmin();
  await ensureLessonExists(lessonId);
  const data = parseResourceFormData(formData);

  await prisma.lessonResource.create({
    data: {
      lessonId,
      title: data.title,
      description: data.description,
      url: data.url,
      type: data.type,
      sortOrder: data.sortOrder,
    },
  });

  revalidateContentPaths();
}

export async function updateLessonResource(
  resourceId: string,
  formData: FormData,
) {
  await requireAdmin();
  const data = parseResourceFormData(formData);

  await prisma.lessonResource.update({
    where: { id: resourceId },
    data: {
      title: data.title,
      description: data.description,
      url: data.url,
      type: data.type,
      sortOrder: data.sortOrder,
    },
  });

  revalidateContentPaths();
}

export async function deleteLessonResource(resourceId: string) {
  await requireAdmin();

  await prisma.lessonResource.delete({
    where: { id: resourceId },
  });

  revalidateContentPaths();
}

export async function associateLessonVideo(
  lessonId: string,
  formData: FormData,
) {
  await requireAdmin();
  await ensureLessonExists(lessonId);

  const parsed = associateVideoSchema.safeParse({
    streamVideoId: readString(formData, "streamVideoId"),
  });

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ?? "Stream Video ID inválido.",
    );
  }

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: { title: true },
  });

  // Set the new Stream Video ID and reset cached metadata.
  await prisma.lesson.update({
    where: { id: lessonId },
    data: {
      streamVideoId: parsed.data.streamVideoId,
      videoProvider: "Cloudflare Stream",
      videoStatus: "PROCESSING",
      videoTitle: lesson?.title ?? null,
      videoUrl: null,
      videoThumbnailUrl: null,
      videoDuration: null,
    },
  });

  // Immediately fetch real status from Cloudflare so the admin sees the
  // result without needing to click "Refrescar estado".
  try {
    const video = await getCloudflareStreamVideo(parsed.data.streamVideoId);

    await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        videoStatus: normalizeStreamVideoStatus(video),
        videoThumbnailUrl: video?.thumbnail ?? undefined,
        videoDuration: video?.duration ? Math.round(video.duration) : undefined,
      },
    });
  } catch (error) {
    console.error(
      `[cloudflare-stream] associateLessonVideo: failed to fetch ${parsed.data.streamVideoId} for lesson ${lessonId}:`,
      error instanceof Error ? error.message : error,
    );
    await prisma.lesson.update({
      where: { id: lessonId },
      data: { videoStatus: "STATUS_UNAVAILABLE" },
    });
    throw new Error(
      "El UID se guardó pero Cloudflare no devolvió datos del video. Verifica que el UID exista en tu cuenta de Cloudflare Stream.",
    );
  }

  revalidateContentPaths();
}

export async function clearLessonVideo(lessonId: string) {
  await requireAdmin();
  await ensureLessonExists(lessonId);

  await prisma.lesson.update({
    where: { id: lessonId },
    data: {
      streamVideoId: null,
      videoProvider: null,
      videoStatus: "NONE",
      videoTitle: null,
      videoUrl: null,
      videoThumbnailUrl: null,
      videoDuration: null,
    },
  });

  revalidateContentPaths();
}

function isPromptPlatform(value: string): value is PromptPlatformValue {
  return (promptPlatforms as readonly string[]).includes(value);
}

function parsePromptAssetFormData(formData: FormData) {
  const rawPlatform = readString(formData, "platform");
  const parsed = promptAssetInputSchema.safeParse({
    title: readString(formData, "title"),
    category: readString(formData, "category"),
    description: readString(formData, "description"),
    body: readString(formData, "body"),
    platform: isPromptPlatform(rawPlatform) ? rawPlatform : "MULTI",
    isPremium: readBoolean(formData, "isPremium"),
    isPublished: readBoolean(formData, "isPublished"),
    sortOrder: readSortOrder(formData),
  });

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ?? "Datos del prompt inválidos.",
    );
  }

  return parsed.data;
}

export async function createPromptAsset(formData: FormData) {
  await requireAdmin();
  const data = parsePromptAssetFormData(formData);

  const promptAsset = await prisma.promptAsset.create({ data });

  revalidateContentPaths();
  redirect(`/admin/biblioteca/${promptAsset.id}`);
}

export async function updatePromptAsset(id: string, formData: FormData) {
  await requireAdmin();
  const data = parsePromptAssetFormData(formData);

  await prisma.promptAsset.update({
    where: { id },
    data,
  });

  revalidateContentPaths();
  redirect("/admin/biblioteca");
}

export async function togglePromptAssetPublished(
  id: string,
  isPublished: boolean,
) {
  await requireAdmin();

  await prisma.promptAsset.update({
    where: { id },
    data: { isPublished },
  });

  revalidateContentPaths();
}

export async function deletePromptAsset(id: string) {
  await requireAdmin();

  await prisma.promptAsset.delete({
    where: { id },
  });

  revalidateContentPaths();
  redirect("/admin/biblioteca");
}
