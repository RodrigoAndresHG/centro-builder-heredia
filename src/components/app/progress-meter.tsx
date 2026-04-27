type ProgressMeterProps = {
  percent: number;
  label?: string;
};

export function ProgressMeter({ percent, label }: ProgressMeterProps) {
  const safePercent = Math.min(100, Math.max(0, percent));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-semibold text-neutral-100">
          {label ?? "Progreso"}
        </span>
        <span className="rounded-full border border-teal-400/20 bg-teal-400/10 px-2.5 py-1 text-xs font-semibold text-teal-200">
          {safePercent}%
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full border border-neutral-800 bg-neutral-950 shadow-inner shadow-black/40">
        <div
          className="h-full rounded-full bg-teal-300 shadow-lg shadow-teal-300/30 transition-all duration-500"
          style={{ width: `${safePercent}%` }}
        />
      </div>
    </div>
  );
}

export function LessonStatusPill({ isCompleted }: { isCompleted: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        isCompleted
          ? "bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-400/20"
          : "bg-neutral-800 text-neutral-300 ring-1 ring-neutral-700"
      }`}
    >
      {isCompleted ? "Completada" : "Pendiente"}
    </span>
  );
}
