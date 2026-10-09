"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLogout } from "@/features/auth/hooks/use-auth";

export function DangerZone() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const logout = useLogout();

  function handleLogout() {
    localStorage.removeItem("students-storage");
    localStorage.removeItem("sessions-storage");
    localStorage.removeItem("payments-storage");
    localStorage.removeItem("auth-storage");
    logout();
  }

  return (
    <>
      <Card className="border-destructive/30">
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-base">خروج از حساب</CardTitle>
              <CardDescription className="mt-1">
                از حساب کاربری خود خارج شوید. داده‌های ذخیره‌شده در دستگاه
                پاک می‌شود.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            onClick={() => setOpen(true)}
            type="button"
            className="w-full"
          >
            خروج از حساب
          </Button>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleLogout}
        title="خروج از حساب"
        description="آیا مطمئنید که می‌خواهید از حساب خود خارج شوید؟"
        confirmLabel="خروج"
      />
    </>
  );
}