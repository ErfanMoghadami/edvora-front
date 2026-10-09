"use client";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NumberInput } from "@/components/ui/number-input";
import { Dialog } from "@/components/ui/dialog";
import { PersianDatePicker } from "@/components/ui/persian-date-picker";
import { cn } from "@/lib/utils";
import { useAddPayment } from "../hooks/use-student-sessions";
import type { Payment } from "@/types/payment";
import type { Student } from "@/types/student";

const schema = yup.object({
  amount: yup
    .number()
    .typeError("مبلغ را وارد کنید")
    .min(1000, "حداقل ۱٬۰۰۰ تومان")
    .required("مبلغ الزامی است"),
  date: yup.string().required("تاریخ الزامی است"),
  method: yup
    .string()
    .oneOf(["cash", "card", "transfer", "other"], "روش پرداخت را انتخاب کنید")
    .required("روش پرداخت را انتخاب کنید"),
  note: yup.string().default(""),
});

type FormValues = yup.InferType<typeof schema>;

interface PaymentFormDialogProps {
  open: boolean;
  onClose: () => void;
  student: Student;
  suggestedAmount?: number;
}

const METHOD_OPTIONS: { value: Payment["method"]; label: string }[] = [
  { value: "cash", label: "نقدی" },
  { value: "card", label: "کارت به کارت" },
  { value: "transfer", label: "انتقال بانکی" },
  { value: "other", label: "سایر" },
];

export function PaymentFormDialog({
  open,
  onClose,
  student,
  suggestedAmount,
}: PaymentFormDialogProps) {
  const addPayment = useAddPayment();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onSubmit",
    defaultValues: {
      amount: suggestedAmount,
      date: "",
      method: undefined,
      note: "",
    },
  });

  function handleClose() {
    reset();
    onClose();
  }

  function onSubmit(data: FormValues) {
    addPayment({
      studentId: student.id,
      amount: data.amount,
      date: data.date,
      method: data.method as Payment["method"],
      note: data.note || undefined,
    });
    handleClose();
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="ثبت پرداخت"
      description={`پرداخت جدید برای ${student.name}`}
      footer={
        <>
          <Button variant="outline" type="button" onClick={handleClose}>
            انصراف
          </Button>
          <Button
            type="submit"
            form="payment-form"
            loading={isSubmitting}
          >
            ثبت پرداخت
          </Button>
        </>
      }
    >
      <form
        id="payment-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <Controller
          control={control}
          name="amount"
          render={({ field }) => (
            <NumberInput
              label="مبلغ پرداخت"
              value={field.value}
              onChange={field.onChange}
              error={errors.amount?.message}
              suffix="تومان"
            />
          )}
        />

        <Controller
          control={control}
          name="date"
          render={({ field }) => (
            <PersianDatePicker
              label="تاریخ پرداخت"
              value={field.value}
              onChange={field.onChange}
              error={errors.date?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="method"
          render={({ field }) => (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                روش پرداخت
              </label>
              <div className="grid grid-cols-2 gap-2">
                {METHOD_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => field.onChange(opt.value)}
                    className={cn(
                      "h-10 rounded-lg border px-3 text-sm font-medium transition-colors",
                      field.value === opt.value
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-foreground hover:bg-muted"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {errors.method?.message && (
                <p className="text-xs text-destructive">
                  {errors.method.message}
                </p>
              )}
            </div>
          )}
        />

        <Controller
          control={control}
          name="note"
          render={({ field }) => (
            <Input
              label="یادداشت (اختیاری)"
              placeholder="مثلاً علی‌الحساب"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </form>
    </Dialog>
  );
}