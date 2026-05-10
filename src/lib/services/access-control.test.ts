import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    access: {
      findFirst: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/db/prisma";
import { canViewerOpenProgram } from "./access-control";

const findFirst = vi.mocked(prisma.access.findFirst);

const baseProgram = { id: "program-1", productId: "product-1" };

describe("canViewerOpenProgram", () => {
  beforeEach(() => {
    findFirst.mockReset();
  });

  it("permite siempre al admin sin tocar la base de datos", async () => {
    const result = await canViewerOpenProgram(
      { id: "user-1", role: "ADMIN" },
      baseProgram,
    );

    expect(result).toBe(true);
    expect(findFirst).not.toHaveBeenCalled();
  });

  it("permite programa sin producto asociado sin tocar la base de datos", async () => {
    const result = await canViewerOpenProgram(
      { id: "user-1", role: "INVITADO" },
      { id: "program-1", productId: null },
    );

    expect(result).toBe(true);
    expect(findFirst).not.toHaveBeenCalled();
  });

  it("permite acceso si existe access ACTIVE por producto", async () => {
    findFirst
      .mockResolvedValueOnce({ id: "access-1" } as never)
      .mockResolvedValueOnce(null);

    const result = await canViewerOpenProgram(
      { id: "user-1", role: "USUARIO_PAGO" },
      baseProgram,
    );

    expect(result).toBe(true);
  });

  it("permite acceso si existe access ACTIVE por programa", async () => {
    findFirst
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ id: "access-2" } as never);

    const result = await canViewerOpenProgram(
      { id: "user-1", role: "USUARIO_PAGO" },
      baseProgram,
    );

    expect(result).toBe(true);
  });

  it("niega acceso cuando no existe ningún access activo", async () => {
    findFirst.mockResolvedValue(null);

    const result = await canViewerOpenProgram(
      { id: "user-1", role: "USUARIO_PAGO" },
      baseProgram,
    );

    expect(result).toBe(false);
  });

  it("filtra por status ACTIVE y rango de fechas al consultar producto", async () => {
    findFirst.mockResolvedValue(null);

    await canViewerOpenProgram(
      { id: "user-1", role: "USUARIO_PAGO" },
      baseProgram,
    );

    const productCall = findFirst.mock.calls[0]?.[0];
    expect(productCall?.where).toMatchObject({
      userId: "user-1",
      productId: "product-1",
      status: "ACTIVE",
    });
    expect(productCall?.where?.startsAt).toEqual({ lte: expect.any(Date) });
    expect(productCall?.where?.OR).toEqual([
      { expiresAt: null },
      { expiresAt: { gt: expect.any(Date) } },
    ]);
  });
});
