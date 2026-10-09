"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="h-10 w-10" />
      </div>
      <h1 className="mb-3 text-2xl font-bold text-foreground">
        خطایی رخ داد
      </h1>
      <p className="mb-8 max-w-md text-sm text-muted-foreground">
        متأسفانه در اجرای این بخش مشکلی پیش آمد. می‌توانید دوباره تلاش کنید یا
        به صفحه اصلی بازگردید.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button onClick={reset}>تلاش دوباره</Button>
        <Button
          variant="outline"
          onClick={() => (window.location.href = "/")}
        >
          بازگشت به خانه
        </Button>
      </div>
    </div>
  );
}