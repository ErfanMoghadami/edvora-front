"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { PersianDatePicker } from "@/components/ui/persian-date-picker";
import { cn } from "@/lib/utils";
import { useAddSession } from "../hooks/use-student-sessions";
import type { SessionStatus } from "@/types/session";
import type { Student } from "@/types/student";

interface SessionFormDialogProps {
  open: boolean;
  onClose: () => void;
  student: Student;
}

const STATUS_OPTIONS: {
  value: SessionStatus;
  label: string;
  hint: string;
}[] = [
  { value: "completed", label: "برگزار شد", hint: "جلسه انجام شده" },
  { value: "canceled", label: "کنسل شد", hint: "جلسه لغو شده" },
  { value: "scheduled", label: "برنامه‌ریزی شده", hint: "جلسه آینده" },
];

export function SessionFormDialog({
  open,
  onClose,
  student,
}: SessionFormDialogProps) {
  const addSession = useAddSession();
  const [date, setDate] = useState("");
  const [status, setStatus] = useState<SessionStatus | undefined>(undefined);
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<{
    date?: string;
    status?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleClose() {
    setDate("");
    setStatus(undefined);
    setNote("");
    setErrors({});
    onClose();
  }

  function handleDateChange(iso: string) {
    setDate(iso);
    if (errors.date) setErrors((e) => ({ ...e, date: undefined }));
  }

  function handleStatusChange(s: SessionStatus) {
    setStatus(s);
    if (errors.status) setErrors((e) => ({ ...e, status: undefined }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const newErrors: { date?: string; status?: string } = {};
    if (!date) newErrors.date = "تاریخ الزامی است";
    if (!status) newErrors.status = "وضعیت را انتخاب کنید";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    addSession({
      studentId: student.id,
      date,
      duration: student.sessionDuration,
      status: status!,
      note: note || undefined,
    });

    setIsSubmitting(false);
    handleClose();
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="ثبت جلسه جدید"
      description={`برای ${student.name} یک جلسه ثبت کنید`}
      footer={
        <>
          <Button variant="outline" type="button" onClick={handleClose}>
            انصراف
          </Button>
          <Button type="submit" form="session-form" loading={isSubmitting}>
            ثبت جلسه
          </Button>
        </>
      }
    >
      <form id="session-form" onSubmit={handleSubmit} className="space-y-4">
        <PersianDatePicker
          label="تاریخ جلسه"
          value={date}
          onChange={handleDateChange}
          error={errors.date}
        />

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            وضعیت جلسه
          </label>
          <div className="grid grid-cols-3 gap-2">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleStatusChange(opt.value)}
                className={cn(
                  "flex flex-col items-start gap-1 rounded-lg border p-2.5 text-right transition-all",
                  status === opt.value
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border bg-background hover:bg-muted"
                )}
              >
                <span
                  className={cn(
                    "text-xs font-semibold",
                    status === opt.value
                      ? "text-primary"
                      : "text-foreground"
                  )}
                >
                  {opt.label}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {opt.hint}
                </span>
              </button>
            ))}
          </div>
          {errors.status && (
            <p className="text-xs text-destructive">{errors.status}</p>
          )}
        </div>

        <Input
          label="یادداشت (اختیاری)"
          placeholder="مثلاً مبحث مشتق"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </form>
    </Dialog>
  );
}