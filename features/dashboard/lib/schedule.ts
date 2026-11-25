import { toGregorian, toJalaali, jalaaliMonthLength } from "jalaali-js";
import { WEEKDAYS } from "@/features/classes/lib/weekdays";
import type { ClassItem } from "@/types/class";

/** تاریخ میلادی؛ ماه ۱ تا ۱۲ */
export interface GDate {
  gy: number;
  gm: number;
  gd: number;
}

/** تاریخ شمسی؛ ماه ۱ تا ۱۲ */
export interface JDate {
  jy: number;
  jm: number;
  jd: number;
}

export const PERSIAN_MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
] as const;

/* ───────────── date helpers (همه UTC-based تا مشکل timezone نداشته باشیم) ───────────── */

function toUtcDate(g: GDate): Date {
  return new Date(Date.UTC(g.gy, g.gm - 1, g.gd));
}

function fromUtcDate(d: Date): GDate {
  return {
    gy: d.getUTCFullYear(),
    gm: d.getUTCMonth() + 1,
    gd: d.getUTCDate(),
  };
}

/** امروز به وقت تهران */
export function getTodayGregorian(): GDate {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tehran",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const get = (type: string) =>
    Number(parts.find((p) => p.type === type)!.value);

  return { gy: get("year"), gm: get("month"), gd: get("day") };
}

export function toIso(g: GDate): string {
  return `${g.gy}-${String(g.gm).padStart(2, "0")}-${String(g.gd).padStart(2, "0")}`;
}

export function addDays(g: GDate, days: number): GDate {
  const d = toUtcDate(g);
  d.setUTCDate(d.getUTCDate() + days);
  return fromUtcDate(d);
}

/** 0 = شنبه ... 6 = جمعه */
export function weekdayIndex(g: GDate): number {
  return (toUtcDate(g).getUTCDay() + 1) % 7;
}

/** شنبه‌ی همان هفته */
export function startOfWeek(g: GDate): GDate {
  return addDays(g, -weekdayIndex(g));
}

export function gregorianToJalaali(g: GDate): JDate {
  return toJalaali(g.gy, g.gm, g.gd);
}

export function jalaaliToGregorian(j: JDate): GDate {
  const { gy, gm, gd } = toGregorian(j.jy, j.jm, j.jd);
  return { gy, gm, gd };
}

export function isSameDate(a: GDate, b: GDate): boolean {
  return a.gy === b.gy && a.gm === b.gm && a.gd === b.gd;
}

/** ماه شمسی بعد از ماه داده‌شده */
export function nextJalaaliMonth(jy: number, jm: number): {
  jy: number;
  jm: number;
} {
  return jm === 12 ? { jy: jy + 1, jm: 1 } : { jy, jm: jm + 1 };
}

export function prevJalaaliMonth(jy: number, jm: number): {
  jy: number;
  jm: number;
} {
  return jm === 1 ? { jy: jy - 1, jm: 12 } : { jy, jm: jm - 1 };
}

/* ───────────── week / month builders ───────────── */

export interface WeekDay {
  index: number;
  label: string;
  date: GDate;
  iso: string;
  jalaali: JDate;
  isToday: boolean;
}

export function buildWeek(weekStart: GDate, today: GDate): WeekDay[] {
  return WEEKDAYS.map((w) => {
    const date = addDays(weekStart, w.value);
    return {
      index: w.value,
      label: w.label,
      date,
      iso: toIso(date),
      jalaali: gregorianToJalaali(date),
      isToday: isSameDate(date, today),
    };
  });
}

export interface MonthCell {
  date: GDate;
  jalaali: JDate;
  iso: string;
  isToday: boolean;
}

/** سلول‌های یک ماه شمسی؛ null = خانه‌ی خالی قبل/بعد از ماه (هفته از شنبه شروع می‌شود) */
export function buildMonth(
  jy: number,
  jm: number,
  today: GDate
): (MonthCell | null)[] {
  const length = jalaaliMonthLength(jy, jm);
  const first = jalaaliToGregorian({ jy, jm, jd: 1 });
  const offset = weekdayIndex(first);

  const cells: (MonthCell | null)[] = [];
  for (let i = 0; i < offset; i++) cells.push(null);

  for (let d = 1; d <= length; d++) {
    const date = addDays(first, d - 1);
    cells.push({
      date,
      jalaali: { jy, jm, jd: d },
      iso: toIso(date),
      isToday: isSameDate(date, today),
    });
  }

  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

/* ───────────── classes ↔ dates ───────────── */

function isoDay(value?: string): string | null {
  return value && value.length >= 10 ? value.slice(0, 10) : null;
}

/** کلاس‌هایی که در این تاریخ برگزار می‌شوند (روز هفته + بازه‌ی ترم)، مرتب‌شده بر اساس ساعت شروع */
export function classesOnDate(classes: ClassItem[], date: GDate): ClassItem[] {
  const iso = toIso(date);
  const dayIndex = weekdayIndex(date);

  return classes
    .filter((cls) => {
      if (!cls.weekdays.includes(dayIndex)) return false;
      const from = isoDay(cls.term.startDate);
      const to = isoDay(cls.term.endDate);
      if (from && iso < from) return false;
      if (to && iso > to) return false;
      return true;
    })
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
}

/** "09:00" → "9:00" */
export function formatClassTime(time: string): string {
  return time.replace(/^0(\d)/, "$1");
}

/* ───────────── colors ───────────── */

export interface ClassColor {
  /** رنگ کارت */
  card: string;
  /** رنگ نقطه در تقویم ماهانه */
  dot: string;
}

// کلاس‌ها باید به صورت کامل (static) نوشته شوند تا Tailwind پیداشان کند
const PALETTE: ClassColor[] = [
  {
    card: "bg-teal-100 text-teal-950 dark:bg-teal-400/20 dark:text-teal-50",
    dot: "bg-teal-400",
  },
  {
    card: "bg-fuchsia-100 text-fuchsia-950 dark:bg-fuchsia-400/20 dark:text-fuchsia-50",
    dot: "bg-fuchsia-400",
  },
  {
    card: "bg-sky-100 text-sky-950 dark:bg-sky-400/20 dark:text-sky-50",
    dot: "bg-sky-400",
  },
  {
    card: "bg-orange-100 text-orange-950 dark:bg-orange-400/20 dark:text-orange-50",
    dot: "bg-orange-400",
  },
  {
    card: "bg-lime-100 text-lime-950 dark:bg-lime-400/20 dark:text-lime-50",
    dot: "bg-lime-500",
  },
  {
    card: "bg-cyan-100 text-cyan-950 dark:bg-cyan-400/20 dark:text-cyan-50",
    dot: "bg-cyan-400",
  },
  {
    card: "bg-violet-100 text-violet-950 dark:bg-violet-400/20 dark:text-violet-50",
    dot: "bg-violet-400",
  },
  {
    card: "bg-rose-100 text-rose-950 dark:bg-rose-400/20 dark:text-rose-50",
    dot: "bg-rose-400",
  },
];

/**
 * هر کلاس یک رنگ ثابت می‌گیرد؛ در همه‌ی روزهایی که برگزار می‌شود همان رنگ را دارد.
 * ترتیب بر اساس تاریخ ساخت است تا با اضافه شدن کلاس جدید رنگ بقیه عوض نشود.
 */
export function buildClassColors(classes: ClassItem[]): Map<string, ClassColor> {
  const sorted = [...classes].sort(
    (a, b) =>
      a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id)
  );
  const map = new Map<string, ClassColor>();
  sorted.forEach((cls, i) => map.set(cls.id, PALETTE[i % PALETTE.length]));
  return map;
}

export const FALLBACK_COLOR: ClassColor = PALETTE[2];
