import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { createProductCheckoutSession } from "@/lib/services";
import { checkoutRequestSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const rawBody = await request.json().catch(() => null);
  const parsed = checkoutRequestSchema.safeParse(rawBody);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error:
          parsed.error.issues[0]?.message ??
          "Producto requerido para iniciar checkout.",
      },
      { status: 400 },
    );
  }

  try {
    const checkoutSession = await createProductCheckoutSession({
      productId: parsed.data.productId,
      productSlug: parsed.data.productSlug,
      user: {
        id: user.id,
        email: user.email,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se pudo iniciar checkout.",
      },
      { status: 400 },
    );
  }
}
