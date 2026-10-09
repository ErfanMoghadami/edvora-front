"use client";

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
import { useChangePassword } from "@/features/auth/hooks/use-auth";
import type { ChangePasswordInput } from "@/types/auth";

const schema = yup.object({
  currentPassword: yup
    .string()
    .min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد")
    .required("رمز فعلی الزامی است"),
  newPassword: yup
    .string()
    .min(6, "رمز عبور جدید باید حداقل ۶ کاراکتر باشد")
    .required("رمز عبور جدید الزامی است")
    .notOneOf(
      [yup.ref("currentPassword")],
      "رمز جدید نباید با رمز فعلی یکسان باشد"
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "تکرار رمز با رمز جدید یکسان نیست")
    .required("تکرار رمز الزامی است"),
});

export function ChangePasswordForm() {
  const { changePassword, loading } = useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordInput>({
    resolver: yupResolver(schema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: ChangePasswordInput) {
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      reset();
    } catch {
      // error handled in hook
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">تغییر رمز عبور</CardTitle>
        <CardDescription>
          برای امنیت بیشتر، رمز عبور خود را به‌صورت دوره‌ای تغییر دهید
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="رمز عبور فعلی"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            {...register("currentPassword")}
            error={errors.currentPassword?.message}
          />
          <Input
            label="رمز عبور جدید"
            type="password"
            placeholder="حداقل ۶ کاراکتر"
            autoComplete="new-password"
            {...register("newPassword")}
            error={errors.newPassword?.message}
          />
          <Input
            label="تکرار رمز عبور جدید"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
          />
          <Button
            type="submit"
            loading={loading}
            className="w-full sm:w-auto"
          >
            تغییر رمز عبور
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}