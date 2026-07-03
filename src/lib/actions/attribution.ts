"use server";

import { cookies } from "next/headers";

import { auth } from "@/lib/auth";
import { ATTRIBUTION_COOKIE, computeAttributionUpdate } from "@/lib/attribution";
import { prisma } from "@/lib/db/prisma";

// Persiste la atribución (cookie bh_attribution) en el usuario autenticado,
// solo si aún no tiene fuente (primer toque). Se invoca desde /app tras el
// login.
//
// Por qué acá y no solo en events.createUser: dentro de events.createUser el
// acceso a cookies() de next/headers es frágil (depende de la propagación del
// contexto a través de @auth/core) y puede fallar silenciosamente tras el
// round-trip de Google OAuth. Este Server Action corre en una petición del
// mismo origen (el POST del action), donde cookies() SIEMPRE tiene el contexto
// de request y la cookie se envía sin depender de SameSite. Captura confiable.
export async function persistAttribution(): Promise<void> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return;
  }

  const store = await cookies();
  const cookieValue = store.get(ATTRIBUTION_COOKIE)?.value;
  if (!cookieValue) {
    return;
  }

  try {
    const current = await prisma.user.findUnique({
      where: { id: userId },
      select: { utmSource: true },
    });

    const data = computeAttributionUpdate(current?.utmSource, cookieValue);
    if (data) {
      await prisma.user.update({ where: { id: userId }, data });
    }
  } catch (error) {
    console.error("[attribution] No se pudo persistir la atribución:", error);
  } finally {
    // Cookie de un solo uso: se limpia una vez considerada.
    store.delete(ATTRIBUTION_COOKIE);
  }
}
