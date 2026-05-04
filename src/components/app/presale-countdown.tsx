"use client";

import { useEffect, useState } from "react";

type PresaleCountdownProps = {
  opensAt: string;
};

function getRemainingParts(opensAt: string) {
  const target = new Date(opensAt).getTime();
  const remaining = Math.max(0, target - Date.now());
  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [
    ["Días", days],
    ["Horas", hours],
    ["Min", minutes],
    ["Seg", seconds],
  ] as const;
}

export function PresaleCountdown({ opensAt }: PresaleCountdownProps) {
  const [parts, setParts] = useState(() => getRemainingParts(opensAt));

  useEffect(() => {
    const interval = window.setInterval(() => {
      setParts(getRemainingParts(opensAt));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [opensAt]);

  return (
    <div className="grid grid-cols-4 gap-2">
      {parts.map(([label, value]) => (
        <div
          key={label}
          className="rounded-2xl border border-neutral-800 bg-neutral-950 p-3 text-center"
        >
          <p className="text-xl font-semibold text-white">
            {value.toString().padStart(2, "0")}
          </p>
          <p className="mt-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-neutral-500">
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}
