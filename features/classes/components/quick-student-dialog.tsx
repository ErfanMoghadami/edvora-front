"use client";

import { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import {
  quickStudentSchema,
  type QuickStudentFormValues,
} from "../lib/validation";
import { useCreateQuickStudent } from "../hooks/use-classes";
import type { SelectedStudent } from "./class-form";

interface QuickStudentDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: (student: SelectedStudent) => void;
}

export function QuickStudentDialog({
  open,
  onClose,
  onCreated,
}: QuickStudentDialogProps) {
  const createStudent = useCreateQuickStudent();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<QuickStudentFormValues>({
    resolver: yupResolver(
      quickStudentSchema
    ) as unknown as Resolver<QuickStudentFormValues>,
    defaultValues: { name: "", phone: "" },
  });

  useEffect(() => {
    if (open) reset({ name: "", phone: "" });
  }, [open, reset]);

  async function submit(values: QuickStudentFormValues) {
    try {
      const student = await createStudent({
        name: values.name.trim(),
        phone: values.phone.trim(),
      });
      onCreated(student);
      onClose();
    } catch {
      // خطا توسط هوک به‌صورت toast نمایش داده می‌شود
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="تعریف دانش‌آموز جدید"
      description="فقط نام و شماره کافی است. نرخ و برنامه را بعداً از صفحه‌ی دانش‌آموز تکمیل کنید."
    >
      <form
        onSubmit={(e) => {
          e.stopPropagation();
          return handleSubmit(submit)(e);
        }}
        className="space-y-4"
      >
        <Input
          label="نام و نام خانوادگی"
          placeholder="مثلاً علی رضایی"
          autoFocus
          {...register("name")}
          error={errors.name?.message}
        />
        <Input
          label="شماره موبایل"
          type="tel"
          inputMode="numeric"
          placeholder="09123456789"
          dir="ltr"
          className="text-right"
          {...register("phone")}
          error={errors.phone?.message}
        />
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            انصراف
          </Button>
          <Button type="submit" loading={isSubmitting}>
            افزودن و انتخاب
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
