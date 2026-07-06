import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import {
  ASSISTANT_DAILY_LIMIT,
  buildLessonContextBlock,
  consumeAssistantQuota,
  isAssistantConfigured,
  runAssistant,
} from "@/lib/services/assistant";
import { getLessonBySlug } from "@/lib/services/learning";
import { assistantChatSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  if (!isAssistantConfigured()) {
    return NextResponse.json(
      {
        error:
          "El asistente no está disponible por ahora. Escribe a soporte@rodriheredia.com.",
      },
      { status: 503 },
    );
  }

  const rawBody = await request.json().catch(() => null);
  const parsed = assistantChatSchema.safeParse(rawBody);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error:
          parsed.error.issues[0]?.message ?? "No pude leer tu mensaje.",
      },
      { status: 400 },
    );
  }

  const quota = await consumeAssistantQuota(user.id);

  if (!quota.allowed) {
    return NextResponse.json(
      {
        error: `Alcanzaste el límite de ${ASSISTANT_DAILY_LIMIT} preguntas por hoy. Vuelve mañana o escribe a soporte@rodriheredia.com.`,
      },
      { status: 429 },
    );
  }

  // Contexto de lección (opcional): se inyecta SOLO si el usuario tiene
  // acceso vigente a esa lección (getLessonBySlug aplica la misma regla que
  // la página). Si algo falla, el asistente responde sin contexto.
  let lessonBlock: string | undefined;
  if (parsed.data.lessonContext) {
    try {
      const { programSlug, lessonSlug } = parsed.data.lessonContext;
      const lessonData = await getLessonBySlug(programSlug, lessonSlug, {
        id: user.id,
        role: user.role,
      });

      // Misma regla de consumo que la página de la lección: en PRESALE solo
      // las lecciones preview son consumibles — el asistente no debe resumir
      // contenido que la UI bloquea hasta la apertura.
      const canConsumeLesson =
        lessonData.program?.status === "OPEN" ||
        Boolean(lessonData.lesson?.isPreview);

      if (
        lessonData.access === "allowed" &&
        lessonData.lesson &&
        canConsumeLesson
      ) {
        lessonBlock = buildLessonContextBlock({
          programTitle: lessonData.program?.title ?? programSlug,
          moduleTitle: lessonData.lesson.moduleTitle ?? null,
          lessonTitle: lessonData.lesson.title,
          lessonContent: lessonData.lesson.content,
          lessonDescription: lessonData.lesson.description,
        });
      }
    } catch (error) {
      console.error("[asistente] Contexto de lección falló:", error);
    }
  }

  try {
    const reply = await runAssistant(parsed.data.messages, lessonBlock);

    return NextResponse.json({ reply });
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        { error: "El asistente está muy solicitado. Intenta en un minuto." },
        { status: 429 },
      );
    }

    if (error instanceof Anthropic.APIError) {
      console.error(
        `[asistente] Anthropic API error ${error.status}:`,
        error.message,
      );
      return NextResponse.json(
        { error: "El asistente tuvo un problema. Intenta de nuevo." },
        { status: 502 },
      );
    }

    console.error("[asistente] Error inesperado:", error);
    return NextResponse.json(
      { error: "El asistente tuvo un problema. Intenta de nuevo." },
      { status: 500 },
    );
  }
}
