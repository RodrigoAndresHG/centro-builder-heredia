import "dotenv/config";

import { prisma } from "../src/lib/db/prisma";

const roles = [
  {
    key: "INVITADO",
    label: "Invitado",
    description: "Usuario autenticado sin compra activa.",
  },
  {
    key: "USUARIO_PAGO",
    label: "Usuario pago",
    description: "Usuario con acceso pagado activo.",
  },
  {
    key: "ADMIN",
    label: "Administrador",
    description: "Usuario con acceso al panel administrativo.",
  },
];

async function main() {
  for (const role of roles) {
    await prisma.role.upsert({
      where: { key: role.key },
      update: {
        label: role.label,
        description: role.description,
      },
      create: role,
    });
  }

  if (process.env.SEED_ADMIN_EMAIL) {
    await prisma.user.upsert({
      where: { email: process.env.SEED_ADMIN_EMAIL },
      update: { roleKey: "ADMIN" },
      create: {
        email: process.env.SEED_ADMIN_EMAIL,
        roleKey: "ADMIN",
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
