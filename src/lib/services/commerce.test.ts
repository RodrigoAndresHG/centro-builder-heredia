import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
      findUniqueOrThrow: vi.fn(),
      update: vi.fn(),
    },
    product: {
      findFirst: vi.fn(),
    },
    purchase: {
      upsert: vi.fn(),
    },
    access: {
      upsert: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

vi.mock("@/lib/stripe", () => ({
  getStripeClient: vi.fn(),
}));

import { prisma } from "@/lib/db/prisma";
import { processCheckoutSession } from "./commerce";

const userFindUnique = vi.mocked(prisma.user.findUnique);
const userUpsert = vi.mocked(prisma.user.upsert);
const productFindFirst = vi.mocked(prisma.product.findFirst);
const purchaseUpsert = vi.mocked(prisma.purchase.upsert);
const transaction = vi.mocked(prisma.$transaction);
const userUpdate = vi.mocked(prisma.user.update);

const buildSession = (overrides: Record<string, unknown> = {}) =>
  ({
    id: "cs_test_123",
    amount_total: 9900,
    currency: "usd",
    customer: "cus_123",
    payment_intent: "pi_123",
    customer_email: "user@example.com",
    customer_details: null,
    created: Math.floor(Date.now() / 1000),
    metadata: {
      userId: "user-1",
      productId: "product-1",
      productSlug: "build-ideacash",
    },
    ...overrides,
  }) as never;

describe("processCheckoutSession", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    userFindUnique.mockResolvedValue({
      id: "user-1",
      email: "user@example.com",
      roleKey: "INVITADO",
    } as never);
    productFindFirst.mockResolvedValue({
      id: "product-1",
      slug: "build-ideacash",
    } as never);
    purchaseUpsert.mockResolvedValue({ id: "purchase-1" } as never);
    transaction.mockResolvedValue([
      { id: "access-1" },
      { roleKey: "INVITADO" },
    ] as never);
    userUpdate.mockResolvedValue({} as never);
  });

  it("registra Purchase como PAID y activa Access cuando grantAccess=true", async () => {
    const session = buildSession();

    await processCheckoutSession(session, { grantAccess: true });

    expect(purchaseUpsert).toHaveBeenCalledTimes(1);
    const upsertCall = purchaseUpsert.mock.calls[0]?.[0];
    expect(upsertCall?.where).toEqual({ stripeCheckoutSessionId: "cs_test_123" });
    expect(upsertCall?.create).toMatchObject({
      userId: "user-1",
      productId: "product-1",
      status: "PAID",
      amountCents: 9900,
      currency: "usd",
    });
    expect(upsertCall?.create?.purchasedAt).toBeInstanceOf(Date);

    expect(transaction).toHaveBeenCalledTimes(1);
  });

  it("registra Purchase como PENDING y NO activa Access cuando grantAccess=false", async () => {
    const session = buildSession();

    await processCheckoutSession(session, { grantAccess: false });

    const upsertCall = purchaseUpsert.mock.calls[0]?.[0];
    expect(upsertCall?.create).toMatchObject({
      status: "PENDING",
      purchasedAt: null,
    });

    expect(transaction).not.toHaveBeenCalled();
    expect(userUpdate).not.toHaveBeenCalled();
  });

  it("hace upsert por stripeCheckoutSessionId para garantizar idempotencia", async () => {
    const session = buildSession();

    await processCheckoutSession(session, { grantAccess: true });

    const upsertCall = purchaseUpsert.mock.calls[0]?.[0];
    expect(upsertCall?.where).toEqual({ stripeCheckoutSessionId: "cs_test_123" });
  });

  it("promueve usuario a USUARIO_PAGO al activar Access si no era admin", async () => {
    transaction.mockResolvedValue([
      { id: "access-1" },
      { roleKey: "INVITADO" },
    ] as never);

    await processCheckoutSession(buildSession(), { grantAccess: true });

    expect(userUpdate).toHaveBeenCalledWith({
      where: { id: "user-1" },
      data: { roleKey: "USUARIO_PAGO" },
    });
  });

  it("NO degrada rol cuando el usuario ya es ADMIN", async () => {
    transaction.mockResolvedValue([
      { id: "access-1" },
      { roleKey: "ADMIN" },
    ] as never);

    await processCheckoutSession(buildSession(), { grantAccess: true });

    expect(userUpdate).not.toHaveBeenCalled();
  });

  it("usa email del checkout cuando metadata.userId no existe en DB", async () => {
    userFindUnique.mockResolvedValueOnce(null);
    userUpsert.mockResolvedValue({
      id: "user-2",
      email: "fallback@example.com",
    } as never);

    const session = buildSession({
      customer_email: "fallback@example.com",
      metadata: { productId: "product-1", productSlug: "build-ideacash" },
    });

    await processCheckoutSession(session, { grantAccess: true });

    expect(userUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { email: "fallback@example.com" },
      }),
    );
  });

  it("falla si el checkout no tiene producto interno válido", async () => {
    productFindFirst.mockResolvedValue(null);

    await expect(
      processCheckoutSession(buildSession(), { grantAccess: true }),
    ).rejects.toThrow(/producto interno/i);
  });

  it("falla si no hay metadata de producto ni en session ni en DB", async () => {
    const session = buildSession({
      metadata: { userId: "user-1" },
    });

    await expect(
      processCheckoutSession(session, { grantAccess: true }),
    ).rejects.toThrow(/producto interno/i);
  });
});
