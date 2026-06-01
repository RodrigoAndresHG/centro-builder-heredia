"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

export async function updateMyName(formData: FormData) {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    redirect("/login?callbackUrl=/app");
  }

  const raw = formData.get("name");
  const name = typeof raw === "string" ? raw.trim() : "";

  // Soft validation: ignore empty or absurdly long values.
  if (name.length < 2 || name.length > 80) {
    return;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { name },
  });

  revalidatePath("/app", "layout");
}
