"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface NumberInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value" | "type"
  > {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  label?: string;
  error?: string;
  hint?: string;
  suffix?: string;
}

const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

function toEnglishDigits(input: string): string {
  let result = "";
  for (const ch of input) {
    const pIdx = PERSIAN_DIGITS.indexOf(ch);
    if (pIdx !== -1) {
      result += String(pIdx);
      continue;
    }
    const aIdx = ARABIC_DIGITS.indexOf(ch);
    if (aIdx !== -1) {
      result += String(aIdx);
      continue;
    }
    result += ch;
  }
  return result;
}

function formatWithCommas(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    { value, onChange, label, error, hint, suffix, className, id, ...props },
    ref
  ) => {
    const inputId = id || props.name;

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      const converted = toEnglishDigits(e.target.value);
      const raw = converted.replace(/[^\d]/g, "");

      if (raw === "") {
        onChange(undefined);
        return;
      }

      const num = Number(raw);
      onChange(Number.isNaN(num) ? undefined : num);
    }

    const displayValue =
      value !== undefined && value !== null ? formatWithCommas(value) : "";

    return (
      <div className="w-full space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-foreground"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={displayValue}
            onChange={handleChange}
            className={cn(
              "flex h-11 w-full rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground transition-colors",
              "placeholder:text-muted-foreground",
              "focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20",
              "disabled:cursor-not-allowed disabled:opacity-50",
              suffix && "pl-16",
              error &&
                "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20",
              className
            )}
            {...props}
          />
          {suffix && (
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              {suffix}
            </span>
          )}
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
        {hint && !error && (
          <p className="text-xs text-muted-foreground">{hint}</p>
        )}
      </div>
    );
  }
);

NumberInput.displayName = "NumberInput";