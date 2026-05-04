import { prisma } from "@/lib/db/prisma";

export async function listAdminAccesses() {
  return prisma.access.findMany({
    orderBy: [{ updatedAt: "desc" }],
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          roleKey: true,
        },
      },
      product: true,
      program: {
        include: {
          product: true,
        },
      },
    },
  });
}

export async function getAdminAccess(id: string) {
  return prisma.access.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          roleKey: true,
        },
      },
      product: true,
      program: {
        include: {
          product: true,
        },
      },
    },
  });
}

export async function listAccessFormOptions() {
  const [users, products, programs] = await Promise.all([
    prisma.user.findMany({
      where: {
        email: {
          not: null,
        },
      },
      orderBy: { email: "asc" },
      select: {
        id: true,
        name: true,
        email: true,
        roleKey: true,
      },
    }),
    prisma.product.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        isActive: true,
      },
    }),
    prisma.program.findMany({
      orderBy: { title: "asc" },
      select: {
        id: true,
        title: true,
        slug: true,
        isPublished: true,
        status: true,
        product: {
          select: {
            name: true,
          },
        },
      },
    }),
  ]);

  return {
    users,
    products,
    programs,
  };
}
