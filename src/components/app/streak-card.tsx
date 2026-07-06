import type { StreakSummary } from "@/lib/streak";

// Franja de racha del dashboard. Mensajes por estado:
// - current 0            → invitación a iniciarla hoy.
// - activa y hoy sumado  → celebración.
// - activa, hoy pendiente→ empujón a mantenerla (es el estado que convierte).
export function StreakCard({ streak }: { streak: StreakSummary }) {
  const { current, longest, activeToday } = streak;

  const message =
    current === 0
      ? "Completa una lección hoy para iniciar tu racha."
      : activeToday
        ? "Hoy ya sumaste. Vuelve mañana para seguirla."
        : "Completa una lección hoy para mantenerla.";

  return (
    <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-300/90">
            Racha de builder
          </p>
          <p className="mt-1 text-2xl font-semibold text-white">
            <span aria-hidden="true">🔥</span> {current}{" "}
            <span className="text-sm font-medium text-neutral-400">
              {current === 1 ? "día" : "días"}
            </span>
          </p>
        </div>
        {longest > 1 ? (
          <div className="shrink-0 text-right">
            <p className="text-xs text-neutral-500">Mejor racha</p>
            <p className="text-sm font-semibold text-neutral-300">
              {longest} días
            </p>
          </div>
        ) : null}
      </div>
      <p className="mt-2 text-xs leading-5 text-neutral-400">{message}</p>
    </div>
  );
}
