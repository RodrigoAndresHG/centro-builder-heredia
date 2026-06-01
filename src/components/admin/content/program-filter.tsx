"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type ProgramOption = {
  id: string;
  title: string;
};

export function ProgramFilter({
  programs,
  selectedProgramId,
}: {
  programs: ProgramOption[];
  selectedProgramId?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("program", value);
    } else {
      params.delete("program");
    }

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="font-semibold text-neutral-600">
        Filtrar por programa
      </span>
      <select
        value={selectedProgramId ?? ""}
        onChange={(event) => handleChange(event.target.value)}
        className="h-10 rounded-md border border-border bg-background px-3 text-sm outline-none transition focus:border-accent"
      >
        <option value="">Todos los programas</option>
        {programs.map((program) => (
          <option key={program.id} value={program.id}>
            {program.title}
          </option>
        ))}
      </select>
    </label>
  );
}
