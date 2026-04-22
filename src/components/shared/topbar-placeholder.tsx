type TopbarPlaceholderProps = {
  label: string;
};

export function TopbarPlaceholder({ label }: TopbarPlaceholderProps) {
  return (
    <div className="sticky top-0 z-10 border-b border-border bg-surface/90 px-5 py-4 backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-semibold text-foreground">{label}</span>
        <span className="rounded-md border border-border px-3 py-1 text-xs font-medium text-neutral-600">
          Placeholder
        </span>
      </div>
    </div>
  );
}
