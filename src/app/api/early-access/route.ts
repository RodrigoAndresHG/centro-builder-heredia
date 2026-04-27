import { NextResponse } from "next/server";

import { createOrUpdateEarlyAccessLead } from "@/lib/services/early-access";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    name?: string;
    email?: string;
    source?: string;
  } | null;

  if (!body) {
    return NextResponse.json(
      { error: "No pudimos leer tus datos. Intenta nuevamente." },
      { status: 400 },
    );
  }

  try {
    await createOrUpdateEarlyAccessLead({
      name: body.name ?? "",
      email: body.email ?? "",
      source: body.source ?? "",
    });

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
