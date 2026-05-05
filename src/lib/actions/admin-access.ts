"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { isAdminRole } from "@/lib/permissions";

export type AccessActionState = {
  type?: "error";
  message?: string;
};

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

function requireField(value: string | null, label: string) {
  if (!value) {
    throw new Error(`${label} es requerido.`);
  }

  return value;
}

function normalizeStatus(status: string | null) {
  if (status === "ACTIVE" || status === "INACTIVE") {
    return status;
  }

  throw new Error("Estado de acceso invalido.");
}

function normalizeSource(source: string | null, { allowStripe = false } = {}) {
  if (source === "MANUAL" || source === "TEST" || (allowStripe && source === "STRIPE")) {
    return source;
  }

  throw new Error("Origen de acceso invalido.");
}

function parseOptionalDate(value: string | null) {
  if (!value) {
    return null;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime())) {
    throw new Error("Fecha invalida.");
  }

  return date;
}

function parseStartsAt(value: string | null) {
  return parseOptionalDate(value) ?? new Date();
}

async function resolveExistingAccessUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
    },
  });

  if (!user) {
    throw new Error("Selecciona un usuario existente del LMS.");
  }

  return user;
}

async function upgradePaidRoleIfNeeded(userId: string, status: string) {
  if (status !== "ACTIVE") {
    return;
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { roleKey: true },
  });

  if (!isAdminRole(user.roleKey)) {
    await prisma.user.update({
      where: { id: userId },
      data: { roleKey: "USUARIO_PAGO" },
    });
  }
}

function readAccessTarget(formData: FormData) {
  const productId = readOptionalString(formData, "productId");
  const programId = readOptionalString(formData, "programId");

  if ((productId && programId) || (!productId && !programId)) {
    throw new Error("Selecciona producto o programa, pero no ambos.");
  }

  return {
    productId,
    programId,
  };
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "No se pudo guardar el acceso. Revisa los datos e intenta de nuevo.";
}

async function ensureNoExistingAccess({
  currentAccessId,
  userId,
  productId,
  programId,
}: {
  currentAccessId?: string;
  userId: string;
  productId: string | null;
  programId: string | null;
}) {
  const existingAccess = productId
    ? await prisma.access.findUnique({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
        select: { id: true },
      })
    : await prisma.access.findUnique({
        where: {
          userId_programId: {
            userId,
            programId: programId as string,
          },
        },
        select: { id: true },
      });

  if (existingAccess && existingAccess.id !== currentAccessId) {
    throw new Error(
      "Este usuario ya tiene un acceso para el producto o programa seleccionado.",
    );
  }
}

function revalidateAccessPaths() {
  revalidatePath("/admin/accesos");
  revalidatePath("/app", "layout");
}

export async function createManualAccess(
  _previousState: AccessActionState | void,
  formData: FormData,
) {
  await requireAdmin();

  let redirectPath = "/admin/accesos";

  try {
    const userId = requireField(readOptionalString(formData, "userId"), "Usuario");
    const status = normalizeStatus(readOptionalString(formData, "status"));
    const source = normalizeSource(readOptionalString(formData, "source"));
    const startsAt = parseStartsAt(readOptionalString(formData, "startsAt"));
    const expiresAt = parseOptionalDate(readOptionalString(formData, "expiresAt"));
    const { productId, programId } = readAccessTarget(formData);
    const user = await resolveExistingAccessUser(userId);

    await ensureNoExistingAccess({
      userId: user.id,
      productId,
      programId,
    });

    const access = await prisma.access.create({
      data: {
        userId: user.id,
        productId,
        programId,
        status,
        source,
        startsAt,
        expiresAt,
      },
      select: { id: true },
    });

    await upgradePaidRoleIfNeeded(user.id, status);
    revalidateAccessPaths();
    redirectPath = `/admin/accesos/${access.id}?saved=1`;
  } catch (error) {
    return {
      type: "error" as const,
      message: getErrorMessage(error),
    };
  }

  redirect(redirectPath);
}

export async function updateManualAccess(
  id: string,
  _previousState: AccessActionState | void,
  formData: FormData,
) {
  await requireAdmin();

  try {
    const userId = requireField(readOptionalString(formData, "userId"), "Usuario");
    const status = normalizeStatus(readOptionalString(formData, "status"));
    const source = normalizeSource(readOptionalString(formData, "source"), {
      allowStripe: true,
    });
    const startsAt = parseStartsAt(readOptionalString(formData, "startsAt"));
    const expiresAt = parseOptionalDate(readOptionalString(formData, "expiresAt"));
    const { productId, programId } = readAccessTarget(formData);
    const user = await resolveExistingAccessUser(userId);

    await ensureNoExistingAccess({
      currentAccessId: id,
      userId: user.id,
      productId,
      programId,
    });

    await prisma.access.update({
      where: { id },
      data: {
        userId: user.id,
        productId,
        programId,
        status,
        source,
        startsAt,
        expiresAt,
      },
    });

    await upgradePaidRoleIfNeeded(user.id, status);
    revalidateAccessPaths();
  } catch (error) {
    return {
      type: "error" as const,
      message: getErrorMessage(error),
    };
  }

  redirect("/admin/accesos");
}

export async function toggleAccessStatus(id: string, status: "ACTIVE" | "INACTIVE") {
  await requireAdmin();

  const access = await prisma.access.update({
    where: { id },
    data: { status },
    select: {
      userId: true,
      status: true,
    },
  });

  await upgradePaidRoleIfNeeded(access.userId, access.status);
  revalidateAccessPaths();
}
