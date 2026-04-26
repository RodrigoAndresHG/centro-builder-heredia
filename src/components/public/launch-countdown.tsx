"use client";

import { useEffect, useState } from "react";

const launchDate = new Date("2026-05-16T10:00:00-05:00").getTime();

function getTimeLeft() {
  const diff = Math.max(0, launchDate - Date.now());

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
  };
}

export function LaunchCountdown() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 30_000);

    return () => window.clearInterval(interval);
  }, []);

  const items = [
    ["Días", timeLeft.days],
    ["Horas", timeLeft.hours],
    ["Min", timeLeft.minutes],
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {items.map(([label, value]) => (
        <div
          key={label}
          className="rounded-lg border border-neutral-800 bg-neutral-950 p-4 text-center"
        >
          <p className="text-3xl font-semibold text-white">{value}</p>
          <p className="mt-1 text-xs font-semibold uppercase text-neutral-500">
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}
