"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthStore } from "@/stores/auth-store";
import { useUpdateProfile } from "@/features/auth/hooks/use-auth";
import type { UpdateProfileInput } from "@/types/auth";

const schema = yup.object({
  name: yup
    .string()
    .trim()
    .min(3, "نام باید حداقل ۳ کاراکتر باشد")
    .required("نام الزامی است"),
  phone: yup
    .string()
    .trim()
    .matches(/^09\d{9}$/, "شماره موبایل باید با ۰۹ شروع شده و ۱۱ رقم باشد")
    .required("شماره موبایل الزامی است"),
});

export function ProfileForm() {
  const user = useAuthStore((s) => s.user);
  const { updateProfile, loading } = useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateProfileInput>({
    resolver: yupResolver(schema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      name: user?.name ?? "",
      phone: user?.phone ?? "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({ name: user.name, phone: user.phone });
    }
  }, [user, reset]);

  async function onSubmit(data: UpdateProfileInput) {
    try {
      await updateProfile(data);
      reset(data);
    } catch {
      // error handled in hook
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">اطلاعات پروفایل</CardTitle>
        <CardDescription>
          نام و شماره موبایل خود را ویرایش کنید
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="نام و نام خانوادگی"
            placeholder="مثلاً کامیار جعفری"
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
          <Button
            type="submit"
            loading={loading}
            disabled={!isDirty}
            className="w-full sm:w-auto"
          >
            ذخیره تغییرات
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}