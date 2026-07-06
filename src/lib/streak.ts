// Cálculo de racha de aprendizaje (días calendario consecutivos con al menos
// una lección completada). Puro y sin dependencias; los días se cuentan en la
// zona horaria del negocio (Ecuador, sin DST) para que "hoy" sea el hoy del
// estudiante y no el del servidor (UTC).

export const STREAK_TIME_ZONE = "America/Guayaquil";

const DAY_MS = 24 * 60 * 60 * 1000;

export type StreakSummary = {
  current: number;
  longest: number;
  activeToday: boolean;
};

function dayKey(date: Date, timeZone: string): string {
  // en-CA → formato YYYY-MM-DD estable.
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone,
  }).format(date);
}

export function computeStreak(
  completedAt: Date[],
  now: Date = new Date(),
  timeZone: string = STREAK_TIME_ZONE,
): StreakSummary {
  if (completedAt.length === 0) {
    return { current: 0, longest: 0, activeToday: false };
  }

  const days = new Set(completedAt.map((date) => dayKey(date, timeZone)));

  const todayKey = dayKey(now, timeZone);
  const activeToday = days.has(todayKey);

  // Racha actual: se ancla en hoy si ya sumó, o en ayer si aún no (la racha
  // "sigue viva" hasta que termine el día sin actividad).
  let current = 0;
  const anchorOffset = activeToday ? 0 : 1;
  if (activeToday || days.has(dayKey(new Date(now.getTime() - DAY_MS), timeZone))) {
    for (let offset = anchorOffset; ; offset++) {
      const key = dayKey(new Date(now.getTime() - offset * DAY_MS), timeZone);
      if (!days.has(key)) {
        break;
      }
      current++;
    }
  }

  // Racha más larga: recorrer los días únicos ordenados y contar corridas
  // consecutivas. Las claves YYYY-MM-DD parseadas como UTC quedan espaciadas
  // exactamente 24h entre días consecutivos.
  const sorted = [...days].sort();
  let longest = 0;
  let run = 0;
  let previous: number | null = null;
  for (const key of sorted) {
    const time = Date.parse(`${key}T00:00:00Z`);
    run = previous !== null && time - previous === DAY_MS ? run + 1 : 1;
    longest = Math.max(longest, run);
    previous = time;
  }

  return { current, longest, activeToday };
}
