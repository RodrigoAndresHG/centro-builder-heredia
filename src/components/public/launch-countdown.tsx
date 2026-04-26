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
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase text-teal-300">
          Cuenta regresiva
        </p>
        <p className="mt-1 text-sm font-medium text-neutral-400">
          Apertura del primer programa del LMS
        </p>
      </div>
      <div className="grid grid-cols-3 gap-3">
      {items.map(([label, value]) => (
        <div
          key={label}
          className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 text-center shadow-lg shadow-black/20 transition duration-300 hover:-translate-y-0.5 hover:border-teal-400/40"
        >
          <p className="text-4xl font-semibold text-white tabular-nums">{value}</p>
          <p className="mt-1 text-xs font-semibold uppercase text-neutral-500">
            {label}
          </p>
        </div>
      ))}
      </div>
    </div>
  );
}
