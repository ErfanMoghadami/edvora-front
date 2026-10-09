"use client";

import { useAuthStore } from "@/stores/auth-store";

export function Greeting() {
  const user = useAuthStore((s) => s.user);

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
        خوش آمدید {user?.name ?? ""} 👋
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        خلاصه‌ای از وضعیت شاگردها و مالی شما
      </p>
    </div>
  );
}