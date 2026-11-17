"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { WEEKDAYS } from "../lib/weekdays";

interface WeekdayPickerProps {
  value: number[];
  onChange: (value: number[]) => void;
  error?: string;
}

export function WeekdayPicker({ value, onChange, error }: WeekdayPickerProps) {
  function toggle(day: number) {
    onChange(
      value.includes(day)
        ? value.filter((d) => d !== day)
        : [...value, day].sort((a, b) => a - b)
    );
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-7">
        {WEEKDAYS.map((day) => {
          const active = value.includes(day.value);
          return (
            <button
              key={day.value}
              type="button"
              aria-pressed={active}
              onClick={() => toggle(day.value)}
              className={cn(
                "flex h-11 items-center justify-center gap-1.5 rounded-lg border text-sm font-medium transition-colors",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground hover:bg-muted"
              )}
            >
              {active && <Check className="h-3.5 w-3.5" />}
              {day.label}
            </button>
          );
        })}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
