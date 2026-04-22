import Stripe from "stripe";

import { prisma } from "@/lib/db/prisma";
import { isAdminRole } from "@/lib/permissions";
import { getStripeClient } from "@/lib/stripe";

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
  return process.env.AUTH_URL ?? "http://localhost:3000";
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
  });

  if (!product) {
    throw new Error("Producto no encontrado o inactivo.");
  }

  if (!product.stripePriceId) {
    throw new Error("El producto no tiene Stripe Price configurado.");
  }

  const stripe = getStripeClient();
  const baseUrl = appUrl();

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
    success_url: `${baseUrl}/app?checkout=success`,
    cancel_url: `${baseUrl}/app?checkout=cancelled`,
    metadata: {
      productId: product.id,
      productSlug: product.slug,
      userId: user.id,
    },
  });
}

async function resolveCheckoutUser(session: Stripe.Checkout.Session) {
  const metadataUserId = session.metadata?.userId;

  if (metadataUserId) {
    const existingUser = await prisma.user.findUnique({
      where: { id: metadataUserId },
    });

    if (existingUser) {
      return existingUser;
    }
  }

  const email =
    session.customer_details?.email ??
    session.customer_email ??
    session.metadata?.userEmail;

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
  const productId = session.metadata?.productId;
  const productSlug = session.metadata?.productSlug;

  const product = await prisma.product.findFirst({
    where: productId ? { id: productId } : { slug: productSlug },
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
        startsAt,
        expiresAt,
      },
      create: {
        userId,
        productId,
        status: "ACTIVE",
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
