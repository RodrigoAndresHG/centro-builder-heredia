type ProgressMeterProps = {
  percent: number;
  label?: string;
};

export function ProgressMeter({ percent, label }: ProgressMeterProps) {
  const safePercent = Math.min(100, Math.max(0, percent));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-semibold text-foreground">
          {label ?? "Progreso"}
        </span>
        <span className="text-neutral-600">{safePercent}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
        <div
          className="h-full rounded-full bg-accent"
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
          ? "bg-emerald-50 text-emerald-700"
          : "bg-neutral-100 text-neutral-600"
      }`}
    >
      {isCompleted ? "Completada" : "Pendiente"}
    </span>
  );
}
