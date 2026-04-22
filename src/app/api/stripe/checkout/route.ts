import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { createProductCheckoutSession } from "@/lib/services";

export async function POST(request: Request) {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    productId?: string;
    productSlug?: string;
  } | null;

  if (!body?.productId && !body?.productSlug) {
    return NextResponse.json(
      { error: "Producto requerido para iniciar checkout." },
      { status: 400 },
    );
  }

  try {
    const checkoutSession = await createProductCheckoutSession({
      productId: body.productId,
      productSlug: body.productSlug,
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
