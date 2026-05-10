import { prisma } from "@/lib/db/prisma";
import type { EarlyAccessRequest } from "@/lib/validators";

export async function createOrUpdateEarlyAccessLead(input: EarlyAccessRequest) {
  return prisma.earlyAccessLead.upsert({
    where: {
      email: input.email,
    },
    update: {
      name: input.name,
      source: input.source,
    },
    create: {
      name: input.name,
      email: input.email,
      source: input.source,
      status: "PENDIENTE",
    },
  });
}

export async function listEarlyAccessLeads() {
  return prisma.earlyAccessLead.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}
