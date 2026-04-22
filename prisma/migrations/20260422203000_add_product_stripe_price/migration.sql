-- Store the Stripe Price connected to each sellable product.
ALTER TABLE "products" ADD COLUMN "stripe_price_id" TEXT;
