"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { cn, getInitials, toPersianDigits } from "@/lib/utils";
import { useStudents } from "@/features/students/hooks/use-students";
import type { SelectedStudent } from "./class-form";

interface AddExistingStudentsDialogProps {
  open: boolean;
  onClose: () => void;
  selected: SelectedStudent[];
  onConfirm: (students: SelectedStudent[]) => void;
}

export function AddExistingStudentsDialog({
  open,
  onClose,
  selected,
  onConfirm,
}: AddExistingStudentsDialogProps) {
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<Set<string>>(new Set());
  // جستجو سمت کلاینت روی لیست شاگردهای لودشده انجام می‌شود
  const { students, isLoading } = useStudents(query);

  useEffect(() => {
    if (open) {
      setQuery("");
      setPicked(new Set(selected.map((s) => s.id)));
    }
    // فقط هنگام باز شدن دیالوگ مقداردهی اولیه شود
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const knownById = useMemo(() => {
    const map = new Map<string, SelectedStudent>();
    for (const s of selected) map.set(s.id, s);
    for (const s of students) {
      map.set(s.id, { id: s.id, name: s.name, phone: s.phone });
    }
    return map;
  }, [selected, students]);

  function toggle(id: string) {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleConfirm() {
    const result: SelectedStudent[] = [];
    picked.forEach((id) => {
      const s = knownById.get(id);
      if (s) result.push(s);
    });
    onConfirm(result);
    onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="افزودن دانش‌آموز موجود"
      description="دانش‌آموزان کلاس را انتخاب کنید"
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose}>
            انصراف
          </Button>
          <Button type="button" onClick={handleConfirm}>
            تأیید ({toPersianDigits(picked.size)})
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <div className="relative">
          <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="جستجو بر اساس نام یا شماره..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pr-9"
            autoFocus
          />
        </div>

        <div className="max-h-72 space-y-1 overflow-y-auto">
          {isLoading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              در حال بارگذاری...
            </p>
          ) : students.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {query.trim()
                ? "شاگردی با این مشخصات پیدا نشد"
                : "هنوز شاگردی ثبت نشده است"}
            </p>
          ) : (
            students.map((s) => {
              const active = picked.has(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggle(s.id)}
                  aria-pressed={active}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-start transition-colors",
                    active
                      ? "border-primary bg-primary/5"
                      : "border-transparent hover:bg-muted"
                  )}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                    {getInitials(s.name)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-foreground">
                      {s.name}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {s.phone}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border",
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border"
                    )}
                  >
                    {active && <Check className="h-3.5 w-3.5" />}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </Dialog>
  );
}
