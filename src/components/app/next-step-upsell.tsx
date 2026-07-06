import { CheckoutButton } from "@/components/app/checkout-button";
import { getNextStepProgram } from "@/lib/services/certificates";
import type { LearningViewer } from "@/lib/services/access-control";

type NextStepUpsellProps = {
  viewer: LearningViewer;
  eyebrow?: string;
};

// Tarjeta de "siguiente peldaño": ofrece el primer programa comprable que el
// usuario aún no tiene, en el momento de máxima propensión (completar un
// programa o una compra). Server component; si no hay siguiente paso, no
// renderiza nada. Un solo upsell por pantalla, sin urgencia artificial.
export async function NextStepUpsell({
  viewer,
  eyebrow = "Tu siguiente peldaño",
}: NextStepUpsellProps) {
  const program = await getNextStepProgram(viewer);

  if (!program?.product?.slug) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-teal-400/25 bg-teal-400/10 p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-300">
        {eyebrow}
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
