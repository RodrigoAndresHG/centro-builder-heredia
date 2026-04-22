"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { getLessonBySlug, markLessonCompleted } from "@/lib/services";

export async function completeLesson(
  programSlug: string,
  lessonSlug: string,
  nextHref?: string,
) {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    redirect(`/login?callbackUrl=/app/programas/${programSlug}/lecciones/${lessonSlug}`);
  }

  const lessonData = await getLessonBySlug(programSlug, lessonSlug, {
    id: user.id,
    role: user.role,
  });

  if (lessonData.access !== "allowed" || !lessonData.lesson) {
    throw new Error("No puedes marcar esta leccion como completada.");
  }

  await markLessonCompleted(user.id, lessonData.lesson.id);

  revalidatePath("/app", "layout");
  revalidatePath(`/app/programas/${programSlug}`);
  revalidatePath(`/app/programas/${programSlug}/modulos/${lessonData.lesson.moduleSlug}`);
  revalidatePath(`/app/programas/${programSlug}/lecciones/${lessonSlug}`);

  if (nextHref) {
    redirect(nextHref);
  }
}
