"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { useClasses } from "@/features/classes/hooks/use-classes";
import { useAuthStore } from "@/stores/auth-store";
import { ROUTES } from "@/lib/constants";
import { cn, toPersianDigits } from "@/lib/utils";
import {
  FALLBACK_COLOR,
  PERSIAN_MONTHS,
  addDays,
  buildClassColors,
  buildWeek,
  classesOnDate,
  getTodayGregorian,
  isSameDate,
  startOfWeek,
  type GDate,
} from "../lib/schedule";
import { ClassEventCard } from "./class-event-card";
import { ScheduleCalendarDialog } from "./schedule-calendar-dialog";

export function UpcomingClasses() {
  const { classes, isLoading, isError, refetch } = useClasses();
  const userName = useAuthStore((s) => s.user?.name);
  const teacher = userName ? `استاد ${userName}` : "استاد";

  const [today] = useState<GDate>(() => getTodayGregorian());
  const [weekStart, setWeekStart] = useState<GDate>(() =>
    startOfWeek(getTodayGregorian())
  );
  const [calendarOpen, setCalendarOpen] = useState(false);

  const week = useMemo(() => buildWeek(weekStart, today), [weekStart, today]);
  const colors = useMemo(() => buildClassColors(classes), [classes]);

  const weekClasses = useMemo(
    () => week.map((day) => classesOnDate(classes, day.date)),
    [week, classes]
  );
  const weekIsEmpty = weekClasses.every((list) => list.length === 0);
  const isCurrentWeek = isSameDate(weekStart, startOfWeek(today));

  return (
    <Card className="overflow-hidden rounded-3xl">
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5">
        <div className="flex items-center gap-2.5">
          <CalendarDays className="h-6 w-6 text-primary" />
          <h2 className="text-base font-bold text-foreground sm:text-lg">
            کلاس‌های پیش رو
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {!isCurrentWeek && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setWeekStart(startOfWeek(today))}
            >
              هفته جاری
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 rounded-lg px-3 text-xs"
            onClick={() => setCalendarOpen(true)}
          >
            <CalendarIcon className="h-3.5 w-3.5" />
            تقویم
          </Button>

          <button
            type="button"
            onClick={() => setWeekStart((w) => addDays(w, -7))}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="هفته قبل"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setWeekStart((w) => addDays(w, 7))}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="هفته بعد"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <WeekSkeleton />
      ) : isError ? (
        <div className="px-4 pb-4">
          <ErrorState onRetry={() => refetch()} />
        </div>
      ) : (
        <div className="relative overflow-x-auto border-t border-border">
          <div className="grid min-w-[760px] grid-cols-7">
            {week.map((day, i) => (
              <div
                key={day.iso}
                className={cn(
                  "min-h-[380px] border-s border-border/60 first:border-s-0",
                  day.isToday && "bg-primary/10"
                )}
              >
                <div className="px-2 pb-3 pt-4 text-center">
                  <p
                    className={cn(
                      "text-sm font-bold",
                      day.isToday ? "text-foreground" : "text-foreground/80"
                    )}
                  >
                    {day.label}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {toPersianDigits(day.jalaali.jd)}{" "}
                    {PERSIAN_MONTHS[day.jalaali.jm - 1]}
                  </p>
                  <div className="mx-auto mt-3 h-px w-3/4 bg-border" />
                </div>

                <div className="space-y-3 px-2 pb-4">
                  {weekClasses[i].map((cls) => (
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
              </div>
            ))}
          </div>

          {weekIsEmpty && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 top-24 flex flex-col items-center justify-center gap-3 text-center">
              <p className="rounded-lg bg-card/80 px-3 py-1 text-sm text-muted-foreground">
                {classes.length === 0
                  ? "هنوز کلاسی نساخته‌اید"
                  : "در این هفته کلاسی ندارید"}
              </p>
              {classes.length === 0 && (
                <Link
                  href={`${ROUTES.CLASSES}/new`}
                  className={cn(buttonVariants({ size: "sm" }), "pointer-events-auto")}
                >
                  ساخت کلاس جدید
                </Link>
              )}
            </div>
          )}
        </div>
      )}

      <ScheduleCalendarDialog
        open={calendarOpen}
        onClose={() => setCalendarOpen(false)}
        today={today}
        classes={classes}
        colors={colors}
        teacher={teacher}
        onPickDate={(date) => setWeekStart(startOfWeek(date))}
      />
    </Card>
  );
}

function WeekSkeleton() {
  return (
    <div className="overflow-x-auto border-t border-border">
      <div className="grid min-w-[760px] grid-cols-7">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="min-h-[380px] space-y-3 p-3">
            <Skeleton className="mx-auto h-4 w-16" />
            <Skeleton className="mx-auto h-3 w-12" />
            {i % 3 !== 2 && <Skeleton className="h-24 w-full rounded-xl" />}
            {i % 2 === 0 && <Skeleton className="h-24 w-full rounded-xl" />}
          </div>
        ))}
      </div>
    </div>
  );
}
