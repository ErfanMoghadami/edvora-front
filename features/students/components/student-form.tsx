"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NumberInput } from "@/components/ui/number-input";
import { PersianDatePicker } from "@/components/ui/persian-date-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";
import { SESSION_DURATIONS, ROUTES } from "@/lib/constants";
import { calculateFinancials } from "../lib/calculations";
import { studentSchema, type StudentFormValues } from "../lib/validation";
import type {
  ProgramType,
  RateType,
  PaymentType,
  Student,
  StudentInput,
} from "@/types/student";

interface StudentFormProps {
  initial?: Student;
  onSubmit: (input: StudentInput) => void;
  submitLabel?: string;
}

export function StudentForm({
  initial,
  onSubmit,
  submitLabel = "ذخیره",
}: StudentFormProps) {
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<StudentFormValues>({
    resolver: yupResolver(
      studentSchema,
    ) as unknown as Resolver<StudentFormValues>,
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: initial
      ? {
          name: initial.name,
          phone: initial.phone,
          notes: initial.notes ?? "",
          programType: initial.programType,
          sessionsCount: initial.sessionsCount,
          sessionDuration: initial.sessionDuration,
          rateType: initial.rateType,
          rateAmount: initial.rateAmount,
          paymentType: initial.paymentType,
          startDate: initial.startDate.slice(0, 10),
        }
      : {
          name: "",
          phone: "",
          notes: "",
          programType: undefined,
          sessionsCount: undefined,
          sessionDuration: undefined,
          rateType: undefined,
          rateAmount: undefined,
          paymentType: undefined,
          startDate: "",
        },
  });

  const values = watch();
  const financials = calculateFinancials(values);

  function handleFormSubmit(data: StudentFormValues) {
    onSubmit(data as StudentInput);
  }

  function handleCancel() {
    router.push(ROUTES.STUDENTS);
  }

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start"
    >
      <div className="space-y-6 lg:col-start-1 lg:row-start-1">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">اطلاعات شاگرد</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="نام و نام خانوادگی"
              placeholder="مثلاً علی رضایی"
              {...register("name")}
              error={errors.name?.message}
            />
            <Input
              label="شماره موبایل"
              type="tel"
              inputMode="numeric"
              placeholder="09123456789"
              {...register("phone")}
              error={errors.phone?.message}
            />
            <Input
              label="یادداشت (اختیاری)"
              placeholder="مثلاً پایه دهم، ریاضی"
              {...register("notes")}
              error={errors.notes?.message}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">الگوی کلاس</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <Controller
              control={control}
              name="programType"
              render={({ field }) => (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    نوع برنامه
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <OptionButton
                      active={field.value === "weekly"}
                      onClick={() => field.onChange("weekly" as ProgramType)}
                      label="هفتگی"
                      hint="تعداد جلسات در هفته"
                    />
                    <OptionButton
                      active={field.value === "monthly"}
                      onClick={() => field.onChange("monthly" as ProgramType)}
                      label="ماهانه"
                      hint="تعداد جلسات در ماه"
                    />
                  </div>
                  {errors.programType?.message && (
                    <p className="text-xs text-destructive">
                      {errors.programType.message}
                    </p>
                  )}
                </div>
              )}
            />

            <Controller
              control={control}
              name="sessionsCount"
              render={({ field }) => (
                <NumberInput
                  label={
                    values.programType === "weekly"
                      ? "تعداد جلسات در هفته"
                      : "تعداد جلسات در ماه"
                  }
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.sessionsCount?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="sessionDuration"
              render={({ field }) => (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    مدت هر جلسه (دقیقه)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SESSION_DURATIONS.map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => field.onChange(d)}
                        className={cn(
                          "h-10 rounded-lg border px-4 text-sm font-medium transition-colors",
                          field.value === d
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background text-foreground hover:bg-muted",
                        )}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                  {errors.sessionDuration?.message && (
                    <p className="text-xs text-destructive">
                      {errors.sessionDuration.message}
                    </p>
                  )}
                </div>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">نرخ و پرداخت</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <Controller
              control={control}
              name="rateType"
              render={({ field }) => (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    نوع نرخ
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <OptionButton
                      active={field.value === "hourly"}
                      onClick={() => field.onChange("hourly" as RateType)}
                      label="ساعتی"
                      hint="بر اساس ساعت"
                    />
                    <OptionButton
                      active={field.value === "per_session"}
                      onClick={() => field.onChange("per_session" as RateType)}
                      label="جلسه‌ای"
                      hint="بر اساس هر جلسه"
                    />
                  </div>
                  {errors.rateType?.message && (
                    <p className="text-xs text-destructive">
                      {errors.rateType.message}
                    </p>
                  )}
                </div>
              )}
            />

            <Controller
              control={control}
              name="rateAmount"
              render={({ field }) => (
                <NumberInput
                  label={
                    values.rateType === "hourly" ? "نرخ هر ساعت" : "نرخ هر جلسه"
                  }
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.rateAmount?.message}
                  suffix="تومان"
                />
              )}
            />

            <Controller
              control={control}
              name="paymentType"
              render={({ field }) => (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    نوع تسویه
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <OptionButton
                      active={field.value === "per_session"}
                      onClick={() =>
                        field.onChange("per_session" as PaymentType)
                      }
                      label="جلسه‌ای"
                      hint="هر جلسه پرداخت"
                    />
                    <OptionButton
                      active={field.value === "lump_sum"}
                      onClick={() => field.onChange("lump_sum" as PaymentType)}
                      label="کلی"
                      hint="یکجا برای ماه"
                    />
                  </div>
                  {errors.paymentType?.message && (
                    <p className="text-xs text-destructive">
                      {errors.paymentType.message}
                    </p>
                  )}
                </div>
              )}
            />

            <Controller
              control={control}
              name="startDate"
              render={({ field }) => (
                <PersianDatePicker
                  label="تاریخ شروع"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.startDate?.message}
                />
              )}
            />
          </CardContent>
        </Card>
      </div>

      <aside className="lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:sticky lg:top-20 lg:self-start">
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-base">خلاصه مالی</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">تعداد جلسات در ماه</span>
              <span className="font-semibold text-foreground">
                {financials.monthlySessions} جلسه
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">مبلغ هر جلسه</span>
              <span className="font-semibold text-foreground">
                {formatCurrency(financials.perSessionAmount)}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-border/60 pt-3">
              <span className="text-sm font-medium text-foreground">
                مبلغ ماهانه
              </span>
              <span className="text-lg font-bold text-primary">
                {formatCurrency(financials.monthlyAmount)}
              </span>
            </div>
          </CardContent>
        </Card>
      </aside>

      <div className="flex flex-col-reverse gap-3 sm:flex-row lg:col-start-1 lg:row-start-2">
        <Button
          type="submit"
          size="lg"
          className="flex-1"
          loading={isSubmitting}
        >
          {submitLabel}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={handleCancel}
        >
          انصراف
        </Button>
      </div>
    </form>
  );
}

interface OptionButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
  hint: string;
}

function OptionButton({ active, onClick, label, hint }: OptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-start gap-1 rounded-lg border p-3 text-right transition-all",
        active
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-border bg-background hover:bg-muted",
      )}
    >
      <span
        className={cn(
          "text-sm font-semibold",
          active ? "text-primary" : "text-foreground",
        )}
      >
        {label}
      </span>
      <span className="text-[11px] text-muted-foreground">{hint}</span>
    </button>
  );
}
