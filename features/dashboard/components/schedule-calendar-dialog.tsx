"use client";

import { useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn, toPersianDigits } from "@/lib/utils";
import type { ClassItem } from "@/types/class";
import {
  PERSIAN_MONTHS,
  buildMonth,
  classesOnDate,
  formatClassTime,
  gregorianToJalaali,
  nextJalaaliMonth,
  prevJalaaliMonth,
  FALLBACK_COLOR,
  type ClassColor,
  type GDate,
} from "../lib/schedule";
import { ClassEventCard } from "./class-event-card";

const WEEKDAY_SHORT = ["ش", "ی", "د", "س", "چ", "پ", "ج"];
const MAX_DOTS = 3;
const MAX_CHIPS = 2;

interface ScheduleCalendarDialogProps {
  open: boolean;
  onClose: () => void;
  today: GDate;
  classes: ClassItem[];
  colors: Map<string, ClassColor>;
  teacher: string;
  onPickDate: (date: GDate) => void;
}

export function ScheduleCalendarDialog({
  open,
  onClose,
  today,
  classes,
  colors,
  teacher,
  onPickDate,
}: ScheduleCalendarDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="تقویم کلاس‌ها"
      description="برنامه‌ی ماه‌های آینده را ببینید"
      className="max-h-[92vh] max-w-3xl overflow-y-auto"
    >
      <CalendarBody
        today={today}
        classes={classes}
        colors={colors}
        teacher={teacher}
        onPickDate={(date) => {
          onPickDate(date);
          onClose();
        }}
      />
    </Dialog>
  );
}

interface CalendarBodyProps {
  today: GDate;
  classes: ClassItem[];
  colors: Map<string, ClassColor>;
  teacher: string;
  onPickDate: (date: GDate) => void;
}

function CalendarBody({
  today,
  classes,
  colors,
  teacher,
  onPickDate,
}: CalendarBodyProps) {
  // تقویم همیشه روی «ماه آینده» باز می‌شود
  const [view, setView] = useState(() => {
    const { jy, jm } = gregorianToJalaali(today);
    return nextJalaaliMonth(jy, jm);
  });
  const [selectedIso, setSelectedIso] = useState<string | null>(null);

  const cells = useMemo(
    () => buildMonth(view.jy, view.jm, today),
    [view, today]
  );

  const selected = useMemo(
    () => cells.find((c) => c && c.iso === selectedIso) ?? null,
    [cells, selectedIso]
  );

  const selectedClasses = selected ? classesOnDate(classes, selected.date) : [];

  function go(next: { jy: number; jm: number }) {
    setView(next);
    setSelectedIso(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => go(prevJalaaliMonth(view.jy, view.jm))}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="ماه قبل"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <p className="text-sm font-semibold text-foreground">
          {PERSIAN_MONTHS[view.jm - 1]} {toPersianDigits(view.jy)}
        </p>

        <button
          type="button"
          onClick={() => go(nextJalaaliMonth(view.jy, view.jm))}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="ماه بعد"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      <div dir="rtl" className="grid grid-cols-7 gap-1 sm:gap-1.5">
        {WEEKDAY_SHORT.map((d) => (
          <div
            key={d}
            className="py-1 text-center text-[11px] font-medium text-muted-foreground"
          >
            {d}
          </div>
        ))}

        {cells.map((cell, i) => {
          if (!cell) return <div key={`empty-${i}`} />;

          const dayClasses = classesOnDate(classes, cell.date);
          const isSelected = cell.iso === selectedIso;
          const extra = dayClasses.length - MAX_CHIPS;

          return (
            <button
              key={cell.iso}
              type="button"
              onClick={() => setSelectedIso(cell.iso)}
              aria-pressed={isSelected}
              className={cn(
                "flex min-h-14 flex-col items-center gap-1 rounded-lg border p-1 text-sm font-medium transition-colors sm:min-h-24 sm:items-stretch sm:p-1.5",
                isSelected
                  ? "border-primary bg-primary/10"
                  : cell.isToday
                    ? "border-primary/40 bg-primary/5 hover:bg-primary/10"
                    : "border-border/60 hover:bg-muted"
              )}
            >
              <span
                className={cn(
                  "text-xs sm:text-start",
                  cell.isToday ? "font-bold text-primary" : "text-foreground"
                )}
              >
                {toPersianDigits(cell.jalaali.jd)}
              </span>

              {/* موبایل: فقط نقطه */}
              <span className="flex h-1.5 items-center gap-0.5 sm:hidden">
                {dayClasses.slice(0, MAX_DOTS).map((cls) => (
                  <span
                    key={cls.id}
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      (colors.get(cls.id) ?? FALLBACK_COLOR).dot
                    )}
                  />
                ))}
              </span>

              {/* دسکتاپ: اسم و ساعت کلاس */}
              <span className="hidden w-full flex-col gap-1 sm:flex">
                {dayClasses.slice(0, MAX_CHIPS).map((cls) => (
                  <span
                    key={cls.id}
                    className={cn(
                      "block truncate rounded-md px-1.5 py-0.5 text-start text-[10px] leading-4",
                      (colors.get(cls.id) ?? FALLBACK_COLOR).card
                    )}
                    title={`${cls.name} ${cls.startTime} - ${cls.endTime}`}
                  >
                    {cls.name}{" "}
                    <span className="opacity-70">
                      {toPersianDigits(formatClassTime(cls.startTime))}
                    </span>
                  </span>
                ))}
                {extra > 0 && (
                  <span className="text-start text-[10px] text-muted-foreground">
                    +{toPersianDigits(extra)} کلاس دیگر
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="space-y-3 border-t border-border pt-4 animate-fade-in">
          <p className="text-xs font-medium text-muted-foreground">
            {toPersianDigits(selected.jalaali.jd)}{" "}
            {PERSIAN_MONTHS[selected.jalaali.jm - 1]}
          </p>

          {selectedClasses.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              در این روز کلاسی ندارید
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {selectedClasses.map((cls) => (
                <ClassEventCard
                  key={cls.id}
                  name={cls.name}
                  startTime={cls.startTime}
                  endTime={cls.endTime}
                  teacher={teacher}
                  color={colors.get(cls.id) ?? FALLBACK_COLOR}
                />
              ))}
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => onPickDate(selected.date)}
          >
            <CalendarDays className="h-4 w-4" />
            نمایش در برنامه‌ی هفتگی
          </Button>
        </div>
      )}
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> feature/classes
