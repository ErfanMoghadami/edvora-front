"use client";

import { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTerms } from "../hooks/use-classes";
import { TermDialog } from "./term-dialog";

interface TermSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function TermSelect({ value, onChange, error }: TermSelectProps) {
  const { terms, isLoading } = useTerms();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="space-y-2">
      <label
        htmlFor="termId"
        className="block text-sm font-medium text-foreground"
      >
        ترم
      </label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <select
            id="termId"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={isLoading}
            className={cn(
              "h-11 w-full appearance-none rounded-lg border border-border bg-background pe-4 ps-10 text-sm text-foreground transition-colors",
              "focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
              "disabled:cursor-not-allowed disabled:opacity-50",
              !value && "text-muted-foreground",
              error && "border-destructive"
            )}
          >
            <option value="">
              {terms.length === 0 && !isLoading
                ? "ابتدا یک ترم بسازید"
                : "انتخاب ترم"}
            </option>
            {terms.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
        <button
          type="button"
          onClick={() => setDialogOpen(true)}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="ترم جدید"
          title="ترم جدید"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}

      <TermDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreated={(term) => onChange(term.id)}
      />
    </div>
  );
}
