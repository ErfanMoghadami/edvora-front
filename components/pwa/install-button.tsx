"use client";

import { Download, Smartphone, Share, Plus } from "lucide-react";
import { toast } from "sonner";
import { useInstallPrompt } from "@/hooks/use-install-prompt";
import { cn } from "@/lib/utils";

interface InstallButtonProps {
  variant?: "menu" | "full";
  onAfterClick?: () => void;
  className?: string;
}

export function InstallButton({
  variant = "menu",
  onAfterClick,
  className,
}: InstallButtonProps) {
  const { canInstall, install, isIos } = useInstallPrompt();

  if (!canInstall) return null;

  async function handleClick() {
    onAfterClick?.();
    const result = await install();

    if (result === "ios") {
      toast.info("برای نصب روی iPhone", {
        description:
          "روی دکمه اشتراک (Share) در Safari بزنید و گزینه «Add to Home Screen» را انتخاب کنید.",
        duration: 8000,
        icon: <Share className="h-4 w-4" />,
      });
      return;
    }

    if (result === "accepted") {
      toast.success("اپ با موفقیت نصب شد");
    } else if (result === "dismissed") {
      // کاربر لغو کرد
    } else {
      toast.error("مرورگر شما از نصب خودکار پشتیبانی نمی‌کند", {
        description:
          "از منوی مرورگر گزینه «نصب برنامه» یا «افزودن به صفحه اصلی» را انتخاب کنید.",
        duration: 6000,
      });
    }
  }

  if (variant === "menu") {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10",
          className
        )}
      >
        {isIos ? (
          <Smartphone className="h-4 w-4" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        <span>نصب اپلیکیشن</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "flex w-full items-center justify-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary/10",
        className
      )}
    >
      <Download className="h-4 w-4" />
      <span>نصب روی دستگاه</span>
      <Plus className="h-3 w-3" />
    </button>
  );
}