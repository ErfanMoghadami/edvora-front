"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ROUTES } from "@/lib/constants";
import { useRegister } from "../hooks/use-auth";

interface FormErrors {
  name?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

export function RegisterForm() {
  const { register, loading } = useRegister();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const newErrors: FormErrors = {};

    if (!form.name.trim()) newErrors.name = "نام الزامی است";
    else if (form.name.trim().length < 3)
      newErrors.name = "نام باید حداقل ۳ کاراکتر باشد";

    if (!form.phone.trim()) newErrors.phone = "شماره موبایل الزامی است";
    else if (!/^09\d{9}$/.test(form.phone))
      newErrors.phone = "شماره موبایل نامعتبر است";

    if (!form.password) newErrors.password = "رمز عبور الزامی است";
    else if (form.password.length < 6)
      newErrors.password = "رمز عبور باید حداقل ۶ کاراکتر باشد";

    if (!form.confirmPassword)
      newErrors.confirmPassword = "تکرار رمز الزامی است";
    else if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "رمز عبور و تکرار آن یکسان نیستند";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    try {
      await register({
        name: form.name,
        phone: form.phone,
        password: form.password,
      });
    } catch {
      // error handled in hook
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>ساخت حساب جدید</CardTitle>
        <CardDescription>برای شروع، اطلاعات زیر را تکمیل کنید</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="نام و نام خانوادگی"
            type="text"
            placeholder="مثلاً علی رضایی"
            value={form.name}
            onChange={(e) => {
              setForm({ ...form, name: e.target.value });
              if (errors.name) setErrors({ ...errors, name: undefined });
            }}
            error={errors.name}
            autoComplete="name"
          />
          <Input
            label="شماره موبایل"
            type="tel"
            inputMode="numeric"
            placeholder="09123456789"
            value={form.phone}
            onChange={(e) => {
              setForm({ ...form, phone: e.target.value });
              if (errors.phone) setErrors({ ...errors, phone: undefined });
            }}
            error={errors.phone}
            autoComplete="tel"
          />
          <Input
            label="رمز عبور"
            type="password"
            placeholder="حداقل ۶ کاراکتر"
            value={form.password}
            onChange={(e) => {
              setForm({ ...form, password: e.target.value });
              if (errors.password)
                setErrors({ ...errors, password: undefined });
            }}
            error={errors.password}
            autoComplete="new-password"
          />
          <Input
            label="تکرار رمز عبور"
            type="password"
            placeholder="••••••••"
            value={form.confirmPassword}
            onChange={(e) => {
              setForm({ ...form, confirmPassword: e.target.value });
              if (errors.confirmPassword)
                setErrors({ ...errors, confirmPassword: undefined });
            }}
            error={errors.confirmPassword}
            autoComplete="new-password"
          />
          <Button type="submit" loading={loading} className="w-full">
            ساخت حساب
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          قبلاً ثبت‌نام کرده‌اید؟{" "}
          <Link
            href={ROUTES.LOGIN}
            className="font-medium text-primary hover:underline"
          >
            وارد شوید
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}