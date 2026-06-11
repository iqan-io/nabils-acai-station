// Live open/closed status for the navbar pill.
//
// Driven off the Mount Lawley flagship trading hours (the late-night shop).
// Times are local Perth time — Western Australia does not observe daylight
// saving, so a fixed "Australia/Perth" timezone read is always correct
// regardless of where the visitor actually is.
//
// Hours mirror the Mt Lawley table in `brand.ts` (kept here as 24h decimals so
// the open/closed maths stays simple — 22.5 === 10:30 PM).

type DayHours = { open: number; close: number };

// 0 = Sunday … 6 = Saturday (matches Date#getDay / Intl weekday order).
const MT_LAWLEY_HOURS: Record<number, DayHours | null> = {
  0: { open: 11, close: 22.5 }, // Sun 11 AM – 10:30 PM
  1: { open: 11, close: 22 }, //   Mon 11 AM – 10 PM
  2: { open: 11, close: 22 }, //   Tue 11 AM – 10 PM
  3: { open: 11, close: 22 }, //   Wed 11 AM – 10 PM
  4: { open: 11, close: 23 }, //   Thu 11 AM – 11 PM
  5: { open: 11, close: 23 }, //   Fri 11 AM – 11 PM
  6: { open: 11, close: 23 }, //   Sat 11 AM – 11 PM
};

const DAY_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

const DAY_LABEL = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export type OpenStatus =
  | { open: true; closesAt: string }
  | { open: false; opensAt: string; opensDay: string | null };

/** "10 PM", "10:30 PM", "11 AM" from a 24h decimal hour. */
function formatHour(t: number): string {
  const h24 = Math.floor(t);
  const minutes = Math.round((t - h24) * 60);
  const period = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return minutes === 0
    ? `${h12} ${period}`
    : `${h12}:${String(minutes).padStart(2, "0")} ${period}`;
}

/** Day-of-week + time in Perth, independent of the visitor's own clock. */
function perthParts(now: Date): { day: number; time: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Australia/Perth",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);

  const get = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? "";

  const day = DAY_INDEX[get("weekday")] ?? 0;
  // hour12:false can emit "24" at midnight in some runtimes — normalise to 0.
  const hour = parseInt(get("hour"), 10) % 24;
  const minute = parseInt(get("minute"), 10);
  return { day, time: hour + minute / 60 };
}

export function getOpenStatus(now: Date = new Date()): OpenStatus {
  const { day, time } = perthParts(now);
  const today = MT_LAWLEY_HOURS[day];

  if (today && time >= today.open && time < today.close) {
    return { open: true, closesAt: formatHour(today.close) };
  }

  // Closed but opening later the same day.
  if (today && time < today.open) {
    return { open: false, opensAt: formatHour(today.open), opensDay: null };
  }

  // Otherwise find the next day that opens (every day currently trades).
  for (let i = 1; i <= 7; i++) {
    const idx = (day + i) % 7;
    const next = MT_LAWLEY_HOURS[idx];
    if (next) {
      return {
        open: false,
        opensAt: formatHour(next.open),
        opensDay: DAY_LABEL[idx],
      };
    }
  }

  return { open: false, opensAt: "", opensDay: null };
}
