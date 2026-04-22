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

async function resolveAccessUser(email: string) {
  return prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      roleKey: "INVITADO",
    },
  });
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

function revalidateAccessPaths() {
  revalidatePath("/admin/accesos");
  revalidatePath("/app", "layout");
}

export async function createManualAccess(formData: FormData) {
  await requireAdmin();

  const email = requireField(readOptionalString(formData, "email"), "Email");
  const status = normalizeStatus(readOptionalString(formData, "status"));
  const startsAt = parseStartsAt(readOptionalString(formData, "startsAt"));
  const expiresAt = parseOptionalDate(readOptionalString(formData, "expiresAt"));
  const { productId, programId } = readAccessTarget(formData);
  const user = await resolveAccessUser(email.toLowerCase());

  if (productId) {
    const access = await prisma.access.upsert({
      where: {
        userId_productId: {
          userId: user.id,
          productId,
        },
      },
      update: {
        status,
        startsAt,
        expiresAt,
      },
      create: {
        userId: user.id,
        productId,
        status,
        startsAt,
        expiresAt,
      },
    });

    await upgradePaidRoleIfNeeded(user.id, status);
    revalidateAccessPaths();
    redirect(`/admin/accesos/${access.id}`);
  }

  const targetProgramId = programId as string;
  const access = await prisma.access.upsert({
    where: {
      userId_programId: {
        userId: user.id,
        programId: targetProgramId,
      },
    },
    update: {
      status,
      startsAt,
      expiresAt,
    },
      create: {
        userId: user.id,
        programId: targetProgramId,
        status,
        startsAt,
      expiresAt,
    },
  });

  await upgradePaidRoleIfNeeded(user.id, status);
  revalidateAccessPaths();
  redirect(`/admin/accesos/${access.id}`);
}

export async function updateManualAccess(id: string, formData: FormData) {
  await requireAdmin();

  const email = requireField(readOptionalString(formData, "email"), "Email");
  const status = normalizeStatus(readOptionalString(formData, "status"));
  const startsAt = parseStartsAt(readOptionalString(formData, "startsAt"));
  const expiresAt = parseOptionalDate(readOptionalString(formData, "expiresAt"));
  const { productId, programId } = readAccessTarget(formData);
  const user = await resolveAccessUser(email.toLowerCase());

  await prisma.access.update({
    where: { id },
    data: {
      userId: user.id,
      productId,
      programId,
      status,
      startsAt,
      expiresAt,
    },
  });

  await upgradePaidRoleIfNeeded(user.id, status);
  revalidateAccessPaths();
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
