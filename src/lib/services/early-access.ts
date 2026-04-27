import { prisma } from "@/lib/db/prisma";

const allowedSources = new Set(["home", "program_build_ideacash"]);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type EarlyAccessLeadSource = "home" | "program_build_ideacash";

export type CreateEarlyAccessLeadInput = {
  name: string;
  email: string;
  source: string;
};

export function validateEarlyAccessLead(input: CreateEarlyAccessLeadInput) {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const source = input.source.trim();

  if (name.length < 2) {
    throw new Error("Ingresa tu nombre para reservar acceso temprano.");
  }

  if (!emailPattern.test(email)) {
    throw new Error("Ingresa un email válido.");
  }

  if (!allowedSources.has(source)) {
    throw new Error("Fuente de acceso temprano no válida.");
  }

  return {
    name,
    email,
    source: source as EarlyAccessLeadSource,
  };
}

export async function createOrUpdateEarlyAccessLead(
  input: CreateEarlyAccessLeadInput,
) {
  const data = validateEarlyAccessLead(input);

  const lead = await prisma.earlyAccessLead.upsert({
    where: {
      email: data.email,
    },
    update: {
      name: data.name,
      source: data.source,
    },
    create: {
      name: data.name,
      email: data.email,
      source: data.source,
      status: "PENDIENTE",
    },
  });

  return lead;
}

export async function listEarlyAccessLeads() {
  return prisma.earlyAccessLead.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}
