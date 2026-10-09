"use client";

import { X } from "lucide-react";
import { PersianDatePicker } from "@/components/ui/persian-date-picker";
import { cn } from "@/lib/utils";
import type { Payment, PaymentFilters } from "@/types/payment";
import type { Student } from "@/types/student";

interface PaymentsFiltersProps {
  filters: PaymentFilters;
  onChange: (filters: PaymentFilters) => void;
  students: Student[];
  onReset: () => void;
}

const METHOD_OPTIONS: {
  value: Payment["method"] | "all";
  label: string;
}[] = [
  { value: "all", label: "همه" },
  { value: "cash", label: "نقدی" },
  { value: "card", label: "کارت به کارت" },
  { value: "transfer", label: "انتقال بانکی" },
  { value: "other", label: "سایر" },
];

export function PaymentsFilters({
  filters,
  onChange,
  students,
  onReset,
}: PaymentsFiltersProps) {
  const hasFilter =
    filters.method !== "all" ||
    filters.studentId !== "all" ||
    filters.fromDate !== "" ||
    filters.toDate !== "";

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">فیلترها</span>
        {hasFilter && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-3 w-3" />
            پاک کردن
          </button>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">
          روش پرداخت
        </label>
        <div className="flex flex-wrap gap-2">
          {METHOD_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange({ ...filters, method: opt.value })}
              className={cn(
                "h-9 rounded-lg border px-3 text-xs font-medium transition-colors",
                filters.method === opt.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground hover:bg-muted"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">
          شاگرد
        </label>
        <select
          value={filters.studentId}
          onChange={(e) =>
            onChange({ ...filters, studentId: e.target.value })
          }
          className={cn(
            "flex h-11 w-full rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground transition-colors",
            "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          )}
        >
          <option value="all">همه شاگردها</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <PersianDatePicker
          label="از تاریخ"
          value={filters.fromDate}
          onChange={(d) => onChange({ ...filters, fromDate: d })}
        />
        <PersianDatePicker
          label="تا تاریخ"
          value={filters.toDate}
          onChange={(d) => onChange({ ...filters, toDate: d })}
        />
      </div>
    </div>
  );
}