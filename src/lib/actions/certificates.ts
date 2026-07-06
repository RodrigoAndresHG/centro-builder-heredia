"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

// Confirma el nombre del usuario para poder emitir su certificado (el cert es
// público y necesita un nombre real). Reusa la validación suave de perfil y
// vuelve a la página de programa completado, que emite al recargar.
export async function confirmCertificateName(
  programSlug: string,
  formData: FormData,
) {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    redirect(`/login?callbackUrl=/app/programas/${programSlug}/completado`);
  }

  const raw = formData.get("name");
  const name = typeof raw === "string" ? raw.trim() : "";

  if (name.length >= 2 && name.length <= 80) {
    await prisma.user.update({
      where: { id: user.id },
      data: { name },
    });
    revalidatePath("/app", "layout");
  }

  redirect(`/app/programas/${programSlug}/completado`);
}
