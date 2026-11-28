"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Clock, UserPlus, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { getInitials, toPersianDigits } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import { classSchema, type ClassFormValues } from "../lib/validation";
import { calcDuration } from "../lib/weekdays";
import {
  clearClassDraft,
  readClassDraft,
  saveClassDraft,
} from "../lib/draft";
import { SectionTitle } from "./section-title";
import { WeekdayPicker } from "./weekday-picker";
import { TermSelect } from "./term-select";
import { AddExistingStudentsDialog } from "./add-existing-students-dialog";
import type { ClassInput } from "@/types/class";
import type { Student } from "@/types/student";

export type SelectedStudent = Pick<Student, "id" | "name" | "phone">;

interface ClassFormProps {
  onSubmit: (input: ClassInput) => Promise<unknown>;
}

export function ClassForm({ onSubmit }: ClassFormProps) {
  const router = useRouter();
  const [students, setStudents] = useState<SelectedStudent[]>([]);
  const [existingOpen, setExistingOpen] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ClassFormValues>({
    resolver: yupResolver(classSchema) as unknown as Resolver<ClassFormValues>,
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      termId: "",
      weekdays: [],
      startTime: "",
      endTime: "",
    },
  });

  // بعد از برگشت از صفحه‌ی «افزودن شاگرد»، فرم و شاگردهای انتخاب‌شده برمی‌گردند
  useEffect(() => {
    const draft = readClassDraft();
    if (!draft) return;
    if (draft.values) reset({ ...getValues(), ...draft.values });
    setStudents(draft.students);
    clearClassDraft();
    // فقط یک‌بار هنگام mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function goToNewStudent() {
    saveClassDraft({ values: getValues(), students });
    router.push(`${ROUTES.STUDENTS}/new?from=class`);
  }

  const startTime = watch("startTime");
  const endTime = watch("endTime");
  const duration = calcDuration(startTime, endTime);

  function removeStudent(id: string) {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  }

  async function submit(values: ClassFormValues) {
    try {
      await onSubmit({
        name: values.name.trim(),
        termId: values.termId,
        weekdays: values.weekdays,
        startTime: values.startTime,
        endTime: values.endTime,
        studentIds: students.map((s) => s.id),
      });
    } catch {
      // خطا توسط هوک به‌صورت toast نمایش داده می‌شود
    }
  }

  return (
    <>
      <Card>
        <CardContent className="p-6 sm:p-8">
          <form onSubmit={handleSubmit(submit)} className="space-y-8" noValidate>
            <h1 className="text-2xl font-bold text-foreground">
              ساخت کلاس جدید
            </h1>

            {/* ۱) اطلاعات پایه */}
            <section className="space-y-4">
              <SectionTitle step={1} title="اطلاعات پایه" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="نام کلاس"
                  placeholder="مثلاً HTML & CSS"
                  {...register("name")}
                  error={errors.name?.message}
                />
                <Controller
                  control={control}
                  name="termId"
                  render={({ field }) => (
                    <TermSelect
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.termId?.message}
                    />
                  )}
                />
              </div>
            </section>

            {/* ۲) زمان‌بندی */}
            <section className="space-y-4">
              <SectionTitle step={2} title="زمان‌بندی" />
              <Controller
                control={control}
                name="weekdays"
                render={({ field }) => (
                  <WeekdayPicker
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.weekdays?.message}
                  />
                )}
              />

              <div className="grid gap-4 sm:grid-cols-3">
                <Input
                  label="ساعت شروع"
                  type="time"
                  dir="ltr"
                  className="text-right"
                  {...register("startTime")}
                  error={errors.startTime?.message}
                />
                <Input
                  label="ساعت پایان"
                  type="time"
                  dir="ltr"
                  className="text-right"
                  {...register("endTime")}
                  error={errors.endTime?.message}
                />
                <div className="space-y-2">
                  <span className="block text-sm font-medium text-foreground">
                    مدت هر جلسه
                  </span>
                  <div className="flex h-11 items-center justify-between rounded-lg border border-border bg-muted/50 px-4 text-sm">
                    <span className="inline-flex items-center gap-2 text-foreground">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {duration !== null
                        ? `${toPersianDigits(duration)} دقیقه`
                        : "—"}
                    </span>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                      خودکار
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* ۳) دانش‌آموزان */}
            <section className="space-y-4">
              <SectionTitle
                step={3}
                title="دانش‌آموزان"
                aside={`${toPersianDigits(students.length)} دانش‌آموز اضافه شده`}
              />

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setExistingOpen(true)}
                  className="border-primary text-primary hover:bg-primary/5 hover:text-primary"
                >
                  <Users className="h-4 w-4" />
                  افزودن دانش‌آموز موجود
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={goToNewStudent}
                >
                  <UserPlus className="h-4 w-4" />
                  تعریف دانش‌آموز جدید
                </Button>
              </div>

              {students.length > 0 && (
                <ul className="flex flex-wrap gap-2">
                  {students.map((s) => (
                    <li
                      key={s.id}
                      className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 py-1 pe-2 ps-1 text-sm"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                        {getInitials(s.name)}
                      </span>
                      <span className="text-foreground">{s.name}</span>
                      <button
                        type="button"
                        onClick={() => removeStudent(s.id)}
                        className="inline-flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        aria-label={`حذف ${s.name}`}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <div className="flex flex-col-reverse gap-2 border-t border-border pt-6 sm:flex-row sm:justify-start">
              <Button type="submit" size="lg" loading={isSubmitting}>
                ساخت کلاس
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => router.push(ROUTES.CLASSES)}
              >
                انصراف
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <AddExistingStudentsDialog
        open={existingOpen}
        onClose={() => setExistingOpen(false)}
        selected={students}
        onConfirm={setStudents}
      />
    </>
  );
}
