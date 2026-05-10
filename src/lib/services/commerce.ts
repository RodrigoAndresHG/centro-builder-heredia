import Stripe from "stripe";

import { prisma } from "@/lib/db/prisma";
import { isAdminRole } from "@/lib/permissions";
import { getStripeClient } from "@/lib/stripe";
import { stripeCheckoutMetadataSchema } from "@/lib/validators";

type CheckoutUser = {
  id: string;
  email?: string | null;
};

type CreateCheckoutSessionInput = {
  productId?: string;
  productSlug?: string;
  user: CheckoutUser;
};

function appUrl() {
  const url = process.env.AUTH_URL;

  if (!url) {
    throw new Error(
      "AUTH_URL no está configurado. Es requerido para generar URLs de Stripe Checkout.",
    );
  }

  return url;
}

function stringId(value: string | Stripe.Customer | Stripe.DeletedCustomer | null) {
  if (!value) {
    return null;
  }

  return typeof value === "string" ? value : value.id;
}

function paymentIntentId(
  value: string | Stripe.PaymentIntent | null,
) {
  if (!value) {
    return null;
  }

  return typeof value === "string" ? value : value.id;
}

export async function createProductCheckoutSession({
  productId,
  productSlug,
  user,
}: CreateCheckoutSessionInput) {
  const product = await prisma.product.findFirst({
    where: {
      isActive: true,
      ...(productId ? { id: productId } : { slug: productSlug }),
    },
    include: {
      programs: {
        select: {
          status: true,
        },
      },
    },
  });

  if (!product) {
    throw new Error("Producto no encontrado o inactivo.");
  }

  if (
    product.programs.length > 0 &&
    !product.programs.some((program) => program.status === "PRESALE" || program.status === "OPEN")
  ) {
    throw new Error("Este producto todavía no está disponible para compra.");
  }

  if (!product.stripePriceId) {
    throw new Error("El producto no tiene Stripe Price configurado.");
  }

  const stripe = getStripeClient();
  const baseUrl = appUrl();
  const checkoutLogoFileId = process.env.STRIPE_CHECKOUT_LOGO_FILE_ID;
  const checkoutIconFileId = process.env.STRIPE_CHECKOUT_ICON_FILE_ID;

  return stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price: product.stripePriceId,
        quantity: 1,
      },
    ],
    customer_email: user.email ?? undefined,
    client_reference_id: user.id,
    branding_settings: {
      display_name: "Rodrigo HeredIA",
      logo: checkoutLogoFileId
        ? { type: "file", file: checkoutLogoFileId }
        : undefined,
      icon: checkoutIconFileId
        ? { type: "file", file: checkoutIconFileId }
        : undefined,
    },
    success_url: `${baseUrl}/app?checkout=success`,
    cancel_url: `${baseUrl}/app?checkout=cancelled`,
    metadata: {
      productId: product.id,
      productSlug: product.slug,
      userId: user.id,
    },
  });
}

function parseCheckoutMetadata(session: Stripe.Checkout.Session) {
  const parsed = stripeCheckoutMetadataSchema.safeParse(session.metadata ?? {});

  return parsed.success ? parsed.data : {};
}

async function resolveCheckoutUser(session: Stripe.Checkout.Session) {
  const metadata = parseCheckoutMetadata(session);

  if (metadata.userId) {
    const existingUser = await prisma.user.findUnique({
      where: { id: metadata.userId },
    });

    if (existingUser) {
      return existingUser;
    }
  }

  const email =
    session.customer_details?.email ??
    session.customer_email ??
    metadata.userEmail;

  if (!email) {
    throw new Error("Checkout sin usuario ni email para asociar compra.");
  }

  return prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      roleKey: "INVITADO",
    },
  });
}

async function resolveCheckoutProduct(session: Stripe.Checkout.Session) {
  const metadata = parseCheckoutMetadata(session);

  if (!metadata.productId && !metadata.productSlug) {
    throw new Error("Checkout sin producto interno valido.");
  }

  const product = await prisma.product.findFirst({
    where: metadata.productId
      ? { id: metadata.productId }
      : { slug: metadata.productSlug },
  });

  if (!product) {
    throw new Error("Checkout sin producto interno valido.");
  }

  return product;
}

export async function activateProductAccess({
  userId,
  productId,
  startsAt = new Date(),
  expiresAt = null,
}: {
  userId: string;
  productId: string;
  startsAt?: Date;
  expiresAt?: Date | null;
}) {
  const [access, user] = await prisma.$transaction([
    prisma.access.upsert({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      update: {
        status: "ACTIVE",
        source: "STRIPE",
        startsAt,
        expiresAt,
      },
      create: {
        userId,
        productId,
        status: "ACTIVE",
        source: "STRIPE",
        startsAt,
        expiresAt,
      },
    }),
    prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { roleKey: true },
    }),
  ]);

  if (!isAdminRole(user.roleKey)) {
    await prisma.user.update({
      where: { id: userId },
      data: { roleKey: "USUARIO_PAGO" },
    });
  }

  return access;
}

export async function processCheckoutSession(
  session: Stripe.Checkout.Session,
  { grantAccess }: { grantAccess: boolean },
) {
  const [user, product] = await Promise.all([
    resolveCheckoutUser(session),
    resolveCheckoutProduct(session),
  ]);
  const status = grantAccess ? "PAID" : "PENDING";
  const purchasedAt = grantAccess
    ? new Date((session.created ?? Math.floor(Date.now() / 1000)) * 1000)
    : null;

  const purchase = await prisma.purchase.upsert({
    where: {
      stripeCheckoutSessionId: session.id,
    },
    update: {
      userId: user.id,
      productId: product.id,
      status,
      amountCents: session.amount_total,
      currency: session.currency,
      stripeCustomerId: stringId(session.customer),
      stripePaymentIntentId: paymentIntentId(session.payment_intent),
      purchasedAt,
    },
    create: {
      userId: user.id,
      productId: product.id,
      status,
      amountCents: session.amount_total,
      currency: session.currency,
      stripeCustomerId: stringId(session.customer),
      stripeCheckoutSessionId: session.id,
      stripePaymentIntentId: paymentIntentId(session.payment_intent),
      purchasedAt,
    },
  });

  const access = grantAccess
    ? await activateProductAccess({
        userId: user.id,
        productId: product.id,
      })
    : null;

  return {
    user,
    product,
    purchase,
    access,
  };
}
