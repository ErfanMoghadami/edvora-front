"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toJalaali, toGregorian, jalaaliMonthLength } from "jalaali-js";

interface PersianDatePickerProps {
  value?: string;
  onChange: (isoDate: string) => void;
  label?: string;
  error?: string;
  placeholder?: string;
}

const PERSIAN_MONTHS = [
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
];

const WEEKDAYS = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

const CELL_SIZE = 40;

function toPersianDigits(input: string | number): string {
  return String(input).replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)]);
}

function parseIso(iso?: string): { jy: number; jm: number; jd: number } | null {
  if (!iso || iso.length !== 10) return null;
  const [gy, gm, gd] = iso.split("-").map(Number);
  if ([gy, gm, gd].some((n) => isNaN(n))) return null;
  const { jy, jm, jd } = toJalaali(gy, gm, gd);
  return { jy, jm, jd };
}

function getTodayJalaali(): { jy: number; jm: number; jd: number } {
  const now = new Date();

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tehran",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const gy = Number(parts.find((p) => p.type === "year")!.value);
  const gm = Number(parts.find((p) => p.type === "month")!.value);
  const gd = Number(parts.find((p) => p.type === "day")!.value);

  return toJalaali(gy, gm, gd);
}

function jalaaliToIso(jy: number, jm: number, jd: number): string {
  const { gy, gm, gd } = toGregorian(jy, jm, jd);
  return `${gy}-${String(gm).padStart(2, "0")}-${String(gd).padStart(2, "0")}`;
}

function getFirstWeekdayOfMonth(jy: number, jm: number): number {
  const { gy, gm, gd } = toGregorian(jy, jm, 1);
  const date = new Date(gy, gm - 1, gd);
  return (date.getDay() + 1) % 7;
}

export function PersianDatePicker({
  value,
  onChange,
  label,
  error,
  placeholder = "انتخاب تاریخ",
}: PersianDatePickerProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const parsed = useMemo(() => parseIso(value), [value]);
  const today = useMemo(() => getTodayJalaali(), []);

  const [viewYear, setViewYear] = useState(parsed?.jy ?? today.jy);
  const [viewMonth, setViewMonth] = useState(parsed?.jm ?? today.jm);

  useEffect(() => {
    if (parsed) {
      setViewYear(parsed.jy);
      setViewMonth(parsed.jm);
    }
  }, [parsed]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  const monthLength = jalaaliMonthLength(viewYear, viewMonth);
  const firstWeekday = getFirstWeekdayOfMonth(viewYear, viewMonth);

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= monthLength; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  function handleSelectDay(day: number) {
    onChange(jalaaliToIso(viewYear, viewMonth, day));
    setOpen(false);
  }

  function prevMonth() {
    if (viewMonth === 1) {
      setViewYear(viewYear - 1);
      setViewMonth(12);
    } else {
      setViewMonth(viewMonth - 1);
    }
  }

  function nextMonth() {
    if (viewMonth === 12) {
      setViewYear(viewYear + 1);
      setViewMonth(1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  }

  function goToToday() {
    setViewYear(today.jy);
    setViewMonth(today.jm);
    onChange(jalaaliToIso(today.jy, today.jm, today.jd));
    setOpen(false);
  }

  function handleClear() {
    onChange("");
    setOpen(false);
  }

  const displayText = parsed
    ? `${toPersianDigits(parsed.jd)} ${PERSIAN_MONTHS[parsed.jm - 1]} ${toPersianDigits(parsed.jy)}`
    : placeholder;

  const isSelected = (day: number) =>
    parsed?.jy === viewYear && parsed?.jm === viewMonth && parsed?.jd === day;

  const isToday = (day: number) =>
    today.jy === viewYear && today.jm === viewMonth && today.jd === day;

  const gridWidth = CELL_SIZE * 7;
  const gridHeight = CELL_SIZE * Math.ceil(cells.length / 7);

  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}

      <div ref={containerRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={cn(
            "flex h-11 w-full items-center justify-between rounded-lg border border-border bg-background px-4 py-2 text-right text-sm transition-colors",
            "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20",
            !value && "text-muted-foreground",
            error &&
              "border-destructive focus:border-destructive focus:ring-destructive/20",
          )}
          aria-haspopup="dialog"
          aria-expanded={open}
        >
          <span>{displayText}</span>
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
        </button>

        {open && (
          <div
            className="absolute right-0 top-full z-[9999] mt-2 rounded-xl border border-border bg-card p-4 shadow-xl animate-slide-down"
            style={{ width: gridWidth + 32 }}
            role="dialog"
          >
            <div className="mb-3 flex items-center justify-between">
              <button
                type="button"
                onClick={prevMonth}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="ماه قبل"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              <div className="text-sm font-semibold text-foreground">
                {PERSIAN_MONTHS[viewMonth - 1]} {toPersianDigits(viewYear)}
              </div>

              <button
                type="button"
                onClick={nextMonth}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="ماه بعد"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>

            <div
              dir="rtl"
              className="grid"
              style={{
                gridTemplateColumns: `repeat(7, ${CELL_SIZE}px)`,
                gridAutoRows: `${CELL_SIZE}px`,
                width: gridWidth,
                height: gridHeight + CELL_SIZE,
              }}
            >
              {WEEKDAYS.map((d) => (
                <div
                  key={`wd-${d}`}
                  className="flex select-none items-center justify-center text-[11px] font-medium text-muted-foreground"
                >
                  {d}
                </div>
              ))}

              {cells.map((day, i) => {
                if (day === null) {
                  return <div key={`e-${i}`} />;
                }

                const selected = isSelected(day);
                const todayMark = isToday(day);

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleSelectDay(day)}
                    style={{ width: CELL_SIZE, height: CELL_SIZE }}
                    className={cn(
                      "flex items-center justify-center rounded-lg text-sm font-medium transition-colors",
                      selected
                        ? "bg-primary text-primary-foreground"
                        : todayMark
                          ? "border border-primary text-primary hover:bg-primary/10"
                          : "text-foreground hover:bg-muted",
                    )}
                  >
                    {toPersianDigits(day)}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <button
                type="button"
                onClick={goToToday}
                className="text-xs font-medium text-primary transition-opacity hover:opacity-80"
              >
                امروز
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                پاک کردن
              </button>
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
