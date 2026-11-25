"use client";

import { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { termSchema, type TermFormValues } from "../lib/validation";
import { useCreateTerm } from "../hooks/use-classes";
import type { Term } from "@/types/class";

interface TermDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: (term: Term) => void;
}

export function TermDialog({ open, onClose, onCreated }: TermDialogProps) {
  const createTerm = useCreateTerm();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TermFormValues>({
    resolver: yupResolver(termSchema) as unknown as Resolver<TermFormValues>,
    defaultValues: { name: "" },
  });

  useEffect(() => {
    if (open) reset({ name: "" });
  }, [open, reset]);

  async function submit(values: TermFormValues) {
    try {
      const term = await createTerm({ name: values.name.trim() });
      onCreated(term);
      onClose();
    } catch {
      // خطا توسط هوک به‌صورت toast نمایش داده می‌شود
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="ترم جدید"
      description="نام ترم را وارد کنید، مثلاً «ترم پاییز ۱۴۰۵»"
    >
      <form
        onSubmit={(e) => {
          // جلوگیری از submit شدن فرم والد (دیالوگ داخل portal است ولی رویدادها در React bubble می‌شوند)
          e.stopPropagation();
          return handleSubmit(submit)(e);
        }}
        className="space-y-4"
      >
        <Input
          label="نام ترم"
          placeholder="ترم پاییز ۱۴۰۵"
          autoFocus
          {...register("name")}
          error={errors.name?.message}
        />
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            انصراف
          </Button>
          <Button type="submit" loading={isSubmitting}>
            افزودن ترم
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
