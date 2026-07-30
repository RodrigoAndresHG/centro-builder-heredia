import { CheckoutButton } from "@/components/app/checkout-button";
import type { LearningViewer } from "@/lib/services/access-control";
import { findPendingProgramByProductSlug } from "@/lib/services/learning";

type PendingPurchaseCardProps = {
  viewer: LearningViewer;
  productSlug: string;
};

// Tarjeta que retoma la intención de compra que venía de /bio (?product=...).
// Se renderiza SIEMPRE que el producto pedido siga pendiente, sin importar si
// el usuario ya tiene otros programas disponibles — antes la única tarjeta con
// checkout vivía en la rama "sin programas disponibles" del dashboard, así que
// quien tenía el curso gratis perdía la intención de compra por completo.
// Si el slug no existe o el usuario ya tiene acceso, no renderiza nada.
export async function PendingPurchaseCard({
  viewer,
  productSlug,
}: PendingPurchaseCardProps) {
  const program = await findPendingProgramByProductSlug(viewer, productSlug);

  if (!program?.product?.slug) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-teal-400/25 bg-teal-400/10 p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-300">
        Termina de activar tu acceso
      </p>
      <h2 className="mt-3 text-2xl font-semibold leading-tight text-white">
        {program.title}
      </h2>
      {program.description ? (
        <p className="mt-3 max-w-2xl text-sm leading-7 text-neutral-300">
          {program.description}
        </p>
      ) : null}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <CheckoutButton
          productSlug={program.product.slug}
          label="Activar acceso"
        />
        <p className="text-xs font-semibold text-neutral-400">
          Pago único · acceso para siempre · sin suscripción
        </p>
      </div>
    </div>
  );
}
