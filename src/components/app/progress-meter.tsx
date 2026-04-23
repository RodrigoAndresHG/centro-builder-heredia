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
        <span className="font-semibold text-teal-300">{safePercent}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-neutral-800">
        <div
          className="h-full rounded-full bg-teal-400"
          style={{ width: `${safePercent}%` }}
        />
      </div>
    </div>
  );
}

export function LessonStatusPill({ isCompleted }: { isCompleted: boolean }) {
  return (
    <span
      className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ${
        isCompleted
          ? "bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-400/20"
          : "bg-neutral-800 text-neutral-300 ring-1 ring-neutral-700"
      }`}
    >
      {isCompleted ? "Completada" : "Pendiente"}
    </span>
  );
}
