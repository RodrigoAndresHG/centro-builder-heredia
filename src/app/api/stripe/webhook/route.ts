import { NextResponse } from "next/server";

import { processCheckoutSession } from "@/lib/services";
import { getStripeClient } from "@/lib/stripe";

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET no esta configurado." },
      { status: 500 },
    );
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Firma de Stripe requerida." },
      { status: 400 },
    );
  }

  const body = await request.text();
  const stripe = getStripeClient();

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret,
    );

    if (event.type === "checkout.session.completed") {
      const checkoutSession = event.data.object;

      await processCheckoutSession(checkoutSession, {
        grantAccess: checkoutSession.payment_status === "paid",
      });
    }

    if (event.type === "checkout.session.async_payment_succeeded") {
      await processCheckoutSession(event.data.object, {
        grantAccess: true,
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se pudo procesar el webhook.",
      },
      { status: 400 },
    );
  }
}
