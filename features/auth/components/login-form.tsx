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
import { useLogin } from "../hooks/use-auth";

export function LoginForm() {
  const { login, loading } = useLogin();
  const [form, setForm] = useState({ phone: "", password: "" });
  const [errors, setErrors] = useState<{ phone?: string; password?: string }>(
    {}
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const newErrors: { phone?: string; password?: string } = {};
    if (!form.phone.trim()) newErrors.phone = "شماره موبایل الزامی است";
    else if (!/^09\d{9}$/.test(form.phone))
      newErrors.phone = "شماره موبایل نامعتبر است";
    if (!form.password) newErrors.password = "رمز عبور الزامی است";
    else if (form.password.length < 6)
      newErrors.password = "رمز عبور باید حداقل ۶ کاراکتر باشد";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    try {
      await login(form);
    } catch {
      // error handled in hook
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>ورود به حساب</CardTitle>
        <CardDescription>
          برای ادامه، شماره موبایل و رمز عبور خود را وارد کنید
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => {
              setForm({ ...form, password: e.target.value });
              if (errors.password)
                setErrors({ ...errors, password: undefined });
            }}
            error={errors.password}
            autoComplete="current-password"
          />
          <Button type="submit" loading={loading} className="w-full">
            ورود
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          حساب کاربری ندارید؟{" "}
          <Link
            href={ROUTES.REGISTER}
            className="font-medium text-primary hover:underline"
          >
            ثبت‌نام کنید
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}