export function StatusBadge({ isPublished }: { isPublished: boolean }) {
  return (
    <span
      className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ${
        isPublished
          ? "bg-emerald-50 text-emerald-700"
          : "bg-neutral-100 text-neutral-600"
      }`}
    >
      {isPublished ? "Publicado" : "Borrador"}
    </span>
  );
}

const programStatusConfig = {
  DRAFT: {
    label: "Borrador",
    className: "bg-neutral-100 text-neutral-600",
  },
  PRESALE: {
    label: "Preventa",
    className: "bg-amber-50 text-amber-700",
  },
  OPEN: {
    label: "Abierto",
    className: "bg-emerald-50 text-emerald-700",
  },
};

export function ProgramStatusBadge({ status }: { status: string }) {
  const config =
    programStatusConfig[status as keyof typeof programStatusConfig] ??
    programStatusConfig.DRAFT;

  return (
    <span
      className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}
