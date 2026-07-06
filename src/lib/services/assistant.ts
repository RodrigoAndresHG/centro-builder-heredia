import Anthropic from "@anthropic-ai/sdk";

import { prisma } from "@/lib/db/prisma";
import { getCommunityUrl } from "@/lib/community";

// Haiku por costo (es un bot de FAQs). Sube a "claude-sonnet-4-6" u
// "claude-opus-4-8" vía env si quieres más capacidad.
const DEFAULT_MODEL = "claude-haiku-4-5";

export const ASSISTANT_DAILY_LIMIT = 20;

export function getAssistantModel() {
  return process.env.ASSISTANT_MODEL?.trim() || DEFAULT_MODEL;
}

export function isAssistantConfigured() {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

let anthropicClient: Anthropic | null = null;

function getAnthropicClient() {
  anthropicClient ??= new Anthropic();
  return anthropicClient;
}

// Precios actuales por slug de producto. La DB no guarda montos (viven en
// Stripe), así que se mantienen aquí — actualiza esta tabla si cambian.
const PRODUCT_PRICES: Record<string, string> = {
  "agente-noticias-ia-1-hora": "USD 9.99 (pago único)",
  "build-ideacash-founder-access": "USD 47 (pago único)",
};

const STATIC_KNOWLEDGE = `
## Qué es Builder HeredIA
Builder HeredIA (builder.rodriheredia.com) es el LMS oficial de Rodrigo HeredIA: un entorno privado con programas para aprender a construir productos reales con IA (Claude, ChatGPT, Gemini). Los programas se componen de módulos y lecciones con video, contenido, prompts copiables y recursos.

## Cuenta y acceso
- Inicio de sesión: con Google o con correo (enlace mágico — el usuario escribe su email, recibe un enlace y entra sin contraseña). Si el enlace no llega en 1-2 minutos, revisar spam/promociones.
- Los programas gratuitos están disponibles para cualquier usuario registrado.
- Los programas de pago se compran con tarjeta vía Stripe (checkout seguro). Al confirmarse el pago, el acceso se activa automáticamente y el programa se desbloquea en /app.

## Pagos y problemas comunes
- "Ya pagué y no veo mi acceso": esperar unos minutos a que Stripe confirme, refrescar la página. Si persiste, escribir a soporte@rodriheredia.com DESDE EL MISMO CORREO con el que entra a Builder, indicando qué compró.
- Reembolsos y casos de facturación: siempre derivar a soporte@rodriheredia.com. No prometas reembolsos ni plazos.
- Nunca pidas contraseñas, códigos ni datos de tarjeta.

## Dentro del LMS (/app)
- Inicio: muestra el programa activo y el siguiente paso recomendado.
- Programas: lista el programa principal y los demás disponibles o por activar.
- Cada lección tiene botón "Completar y seguir" para guardar progreso; el avance se ve en el dashboard y en el mapa del programa.
- Si un video no carga: refrescar la página; si persiste, escribir a soporte.
- Biblioteca (/app/biblioteca): prompts listos para copiar (Claude, ChatGPT, Gemini), con búsqueda y categorías. Los prompts "Premium" se desbloquean comprando cualquier programa de pago.
- Novedades: publicaciones y tips del ecosistema.
- Soporte (/app/soporte): ayuda rápida y contacto.

## Comunidad
Canal de WhatsApp con novedades, nuevos módulos y avisos de Lives: COMMUNITY_URL

## Soporte humano
Correo: soporte@rodriheredia.com (responder desde el correo de la cuenta).
`.trim();

type ProgramSummary = {
  title: string;
  status: string;
  productSlug: string | null;
  productName: string | null;
};

async function getProgramsSummary(): Promise<ProgramSummary[]> {
  const programs = await prisma.program.findMany({
    where: { status: { in: ["PRESALE", "OPEN"] } },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: {
      title: true,
      status: true,
      product: { select: { slug: true, name: true } },
    },
  });

  return programs.map((program) => ({
    title: program.title,
    status: program.status,
    productSlug: program.product?.slug ?? null,
    productName: program.product?.name ?? null,
  }));
}

function formatProgramsBlock(programs: ProgramSummary[]) {
  if (programs.length === 0) {
    return "## Programas publicados\n(Por el momento no hay programas publicados.)";
  }

  const lines = programs.map((program) => {
    const price = program.productSlug
      ? (PRODUCT_PRICES[program.productSlug] ??
        "precio visible en la página del programa")
      : "Gratis para usuarios registrados";
    const state = program.status === "PRESALE" ? "en preventa" : "abierto";

    return `- ${program.title} — ${state} — ${price}`;
  });

  return `## Programas publicados (datos reales)\n${lines.join("\n")}`;
}

export async function buildAssistantSystemPrompt() {
  const programs = await getProgramsSummary();
  const knowledge = STATIC_KNOWLEDGE.replace(
    "COMMUNITY_URL",
    getCommunityUrl(),
  );

  return `Eres el Asistente Builder, el ayudante oficial dentro del LMS Builder HeredIA. Respondes dudas de los usuarios sobre la plataforma: cuentas, accesos, pagos, programas, lecciones, progreso, biblioteca de prompts y soporte.

Reglas:
- Responde SIEMPRE en español neutro latinoamericano, con "tú".
- Sé breve: 2 a 4 frases por respuesta. Ve directo a la solución.
- Escribe en texto plano. NO uses Markdown: nada de asteriscos para negritas (**), ni almohadillas (#), ni viñetas con guiones o numeradas. Si necesitas enumerar pasos, hazlo en una frase corrida separando con punto y coma.
- Usa ÚNICAMENTE la información de este documento. Si algo no está aquí (o te preguntan precios/fechas/políticas que no aparecen), dilo honestamente y deriva a soporte@rodriheredia.com.
- Temas fuera del LMS (programación general, tareas, otros productos): explica amablemente que solo ayudas con Builder HeredIA. Si quieren aprender IA, sugiere los programas del LMS.
- Casos de pago no reflejado, reembolsos o errores: deriva a soporte@rodriheredia.com (escribiendo desde el correo de su cuenta).
- Nunca pidas contraseñas, códigos de verificación ni datos de tarjeta. Nunca inventes enlaces.

${knowledge}

${formatProgramsBlock(programs)}`;
}

export type AssistantTurn = {
  role: "user" | "assistant";
  content: string;
};

// Tope de caracteres del contenido de la lección inyectado al prompt
// (control de costo: ~2k tokens; Haiku lo cachea entre preguntas seguidas).
const LESSON_CONTEXT_MAX_CHARS = 8000;

export type AssistantLessonContext = {
  programTitle: string;
  moduleTitle: string | null;
  lessonTitle: string;
  lessonContent: string | null;
  lessonDescription: string | null;
};

// Bloque de sistema adicional cuando el usuario pregunta desde una lección.
// El acceso YA fue validado por el route handler (getLessonBySlug).
export function buildLessonContextBlock(
  context: AssistantLessonContext,
): string {
  const body =
    context.lessonContent?.trim() ||
    context.lessonDescription?.trim() ||
    "(La lección es principalmente en video; no hay texto adicional.)";

  return `## Lección que el usuario está viendo AHORA
Programa: ${context.programTitle}
${context.moduleTitle ? `Módulo: ${context.moduleTitle}\n` : ""}Lección: ${context.lessonTitle}

CONTENIDO DE LA LECCIÓN (fuente de verdad para preguntas sobre la lección):
${body.slice(0, LESSON_CONTEXT_MAX_CHARS)}

Instrucciones adicionales:
- Si la pregunta es sobre esta lección, respóndela usando este contenido (explica, resume o aclara con tus palabras, en el mismo tono breve).
- Si pide un resumen, entrega 3-4 ideas clave en frases cortas.
- Si la pregunta va más allá del contenido de la lección, dilo honestamente y sugiere continuar con la lección o escribir a soporte.`;
}

export async function runAssistant(
  messages: AssistantTurn[],
  lessonBlock?: string,
) {
  const client = getAnthropicClient();
  const systemPrompt = await buildAssistantSystemPrompt();

  const response = await client.messages.create({
    model: getAssistantModel(),
    // Tope deliberado: respuestas cortas de FAQ (2-4 frases) + control de costo.
    max_tokens: 600,
    system: [
      {
        type: "text",
        text: systemPrompt,
        // El marcador es inocuo bajo el mínimo cacheable del modelo y empieza
        // a ahorrar costo automáticamente cuando el conocimiento crezca.
        cache_control: { type: "ephemeral" },
      },
      // Segundo bloque (opcional): la lección actual. Breakpoint de caché
      // propio: preguntas seguidas sobre la misma lección reusan el prefijo.
      ...(lessonBlock
        ? [
            {
              type: "text" as const,
              text: lessonBlock,
              cache_control: { type: "ephemeral" as const },
            },
          ]
        : []),
    ],
    messages,
  });

  return response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("")
    .trim();
}

// Incrementa el contador diario del usuario y devuelve si aún tiene cuota.
export async function consumeAssistantQuota(userId: string) {
  const day = new Date().toISOString().slice(0, 10);

  const usage = await prisma.assistantUsage.upsert({
    where: { userId_day: { userId, day } },
    update: { count: { increment: 1 } },
    create: { userId, day, count: 1 },
  });

  return {
    allowed: usage.count <= ASSISTANT_DAILY_LIMIT,
    used: usage.count,
  };
}
