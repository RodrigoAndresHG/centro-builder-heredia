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

const ideaCashProgram = {
  product: {
    slug: "build-ideacash-founder-access",
    name: "Build IdeaCash — Founder Access",
    description:
      "Acceso fundador al programa para convertir una idea en una oferta vendible y validable.",
    stripePriceId: process.env.STRIPE_IDEACASH_PRICE_ID ?? null,
  },
  program: {
    slug: "build-ideacash-founder-access",
    title: "Build IdeaCash — Founder Access",
    description:
      "Un sistema compacto para aterrizar una idea, encontrar su comprador inicial y preparar una primera oferta que se pueda vender sin sobreconstruir.",
  },
  modules: [
    {
      slug: "claridad-de-oferta",
      title: "Claridad de oferta",
      description:
        "Define que vendes, para quien existe y por que alguien pagaria ahora.",
      sortOrder: 1,
      lessons: [
        {
          slug: "mapa-de-idea-a-oferta",
          title: "Mapa de idea a oferta",
          description:
            "Convierte una intuicion amplia en una promesa concreta y vendible.",
          content:
            "Antes de construir, escribe la transformacion que prometes en una frase: quien llega, que problema trae y que resultado obtiene. Una oferta inicial no necesita explicar todo tu producto; necesita dejar claro el cambio que el cliente compra. Usa esta estructura: Ayudo a [perfil] a lograr [resultado] sin [friccion principal]. Luego elimina adornos hasta que la frase sea facil de repetir.",
          videoUrl: null,
          sortOrder: 1,
        },
        {
          slug: "cliente-con-dolor-real",
          title: "Cliente con dolor real",
          description:
            "Identifica una audiencia con urgencia suficiente para responder.",
          content:
            "Un buen cliente inicial no es solo quien podria beneficiarse; es quien ya esta intentando resolver el problema. Busca senales de gasto, busqueda activa, frustracion repetida o procesos manuales costosos. La meta de esta leccion es elegir un segmento estrecho donde puedas conversar esta semana y escuchar lenguaje real antes de escribir mensajes de venta.",
          videoUrl: null,
          sortOrder: 2,
        },
        {
          slug: "promesa-minima-vendible",
          title: "Promesa minima vendible",
          description:
            "Reduce el alcance a una promesa que puedas cumplir de forma excelente.",
          content:
            "La primera version debe ser pequena, especifica y entregable. No prometas plataforma, comunidad, automatizacion y acompanamiento si todavia no tienes evidencia. Promete un resultado puntual que puedas producir con servicio manual, plantillas o una sesion guiada. Esa restriccion protege margen, aprendizaje y confianza.",
          videoUrl: null,
          sortOrder: 3,
        },
      ],
    },
    {
      slug: "validacion-y-venta-inicial",
      title: "Validacion y venta inicial",
      description:
        "Prepara conversaciones, senales de demanda y una primera venta controlada.",
      sortOrder: 2,
      lessons: [
        {
          slug: "mensaje-de-validacion",
          title: "Mensaje de validacion",
          description:
            "Escribe un mensaje corto para abrir conversaciones sin sonar generico.",
          content:
            "Tu mensaje no debe vender demasiado pronto. Debe abrir una conversacion con contexto, una observacion concreta y una pregunta facil de responder. Evita pedir feedback abstracto. Pregunta por una situacion reciente, por el costo del problema o por como lo resuelven hoy. La calidad de las respuestas te dira si hay tension real.",
          videoUrl: null,
          sortOrder: 1,
        },
        {
          slug: "primer-paquete-founder",
          title: "Primer paquete Founder",
          description:
            "Disena un paquete fundador simple, limitado y facil de explicar.",
          content:
            "Un paquete founder debe sentirse como una oportunidad temprana, no como un descuento desesperado. Define cupos limitados, una entrega clara, un precio inicial y una fecha de inicio. Lo importante es que el comprador entienda que esta entrando antes, con mas cercania y con una promesa concreta que puedes cumplir.",
          videoUrl: null,
          sortOrder: 2,
        },
        {
          slug: "criterios-de-siguiente-paso",
          title: "Criterios de siguiente paso",
          description:
            "Decide si construir, ajustar o descartar con base en senales reales.",
          content:
            "No uses entusiasmo como unica metrica. Busca respuestas especificas, reuniones aceptadas, objeciones repetidas y disposicion a pagar. Si nadie acepta una conversacion, ajusta segmento o dolor. Si conversan pero no pagan, ajusta promesa o precio. Si pagan, entrega manualmente y documenta lo que debe convertirse en producto.",
          videoUrl: null,
          sortOrder: 3,
        },
      ],
    },
  ],
};

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

  const product = await prisma.product.upsert({
    where: { slug: ideaCashProgram.product.slug },
    update: {
      name: ideaCashProgram.product.name,
      description: ideaCashProgram.product.description,
      stripePriceId: ideaCashProgram.product.stripePriceId,
      isActive: true,
    },
    create: {
      slug: ideaCashProgram.product.slug,
      name: ideaCashProgram.product.name,
      description: ideaCashProgram.product.description,
      stripePriceId: ideaCashProgram.product.stripePriceId,
      isActive: true,
    },
  });

  const program = await prisma.program.upsert({
    where: { slug: ideaCashProgram.program.slug },
    update: {
      productId: product.id,
      title: ideaCashProgram.program.title,
      description: ideaCashProgram.program.description,
      isPublished: true,
    },
    create: {
      productId: product.id,
      slug: ideaCashProgram.program.slug,
      title: ideaCashProgram.program.title,
      description: ideaCashProgram.program.description,
      isPublished: true,
    },
  });

  for (const moduleSeed of ideaCashProgram.modules) {
    const programModule = await prisma.module.upsert({
      where: {
        programId_slug: {
          programId: program.id,
          slug: moduleSeed.slug,
        },
      },
      update: {
        title: moduleSeed.title,
        description: moduleSeed.description,
        sortOrder: moduleSeed.sortOrder,
        isPublished: true,
      },
      create: {
        programId: program.id,
        slug: moduleSeed.slug,
        title: moduleSeed.title,
        description: moduleSeed.description,
        sortOrder: moduleSeed.sortOrder,
        isPublished: true,
      },
    });

    for (const lessonSeed of moduleSeed.lessons) {
      await prisma.lesson.upsert({
        where: {
          programId_slug: {
            programId: program.id,
            slug: lessonSeed.slug,
          },
        },
        update: {
          moduleId: programModule.id,
          title: lessonSeed.title,
          description: lessonSeed.description,
          content: lessonSeed.content,
          videoUrl: lessonSeed.videoUrl,
          sortOrder: lessonSeed.sortOrder,
          isPublished: true,
        },
        create: {
          programId: program.id,
          moduleId: programModule.id,
          slug: lessonSeed.slug,
          title: lessonSeed.title,
          description: lessonSeed.description,
          content: lessonSeed.content,
          videoUrl: lessonSeed.videoUrl,
          sortOrder: lessonSeed.sortOrder,
          isPublished: true,
        },
      });
    }
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

  if (process.env.SEED_ACCESS_EMAIL) {
    const accessUser = await prisma.user.upsert({
      where: { email: process.env.SEED_ACCESS_EMAIL },
      update: {},
      create: {
        email: process.env.SEED_ACCESS_EMAIL,
        roleKey: "USUARIO_PAGO",
      },
    });

    if (accessUser.roleKey !== "ADMIN") {
      await prisma.user.update({
        where: { id: accessUser.id },
        data: { roleKey: "USUARIO_PAGO" },
      });
    }

    await prisma.access.upsert({
      where: {
        userId_productId: {
          userId: accessUser.id,
          productId: product.id,
        },
      },
      update: {
        status: "ACTIVE",
        startsAt: new Date(),
        expiresAt: null,
      },
      create: {
        userId: accessUser.id,
        productId: product.id,
        status: "ACTIVE",
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
