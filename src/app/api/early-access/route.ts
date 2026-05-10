import { NextResponse } from "next/server";

import { createOrUpdateEarlyAccessLead } from "@/lib/services/early-access";
import { earlyAccessRequestSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const rawBody = await request.json().catch(() => null);
  const parsed = earlyAccessRequestSchema.safeParse(rawBody);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error:
          parsed.error.issues[0]?.message ??
          "No pudimos leer tus datos. Intenta nuevamente.",
      },
      { status: 400 },
    );
  }

  try {
    await createOrUpdateEarlyAccessLead(parsed.data);

    return NextResponse.json({
      ok: true,
      message:
        "Quedaste en la lista prioritaria. Te avisaré antes de la apertura.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No pudimos guardar tu acceso temprano.",
      },
      { status: 400 },
    );
  }
}
