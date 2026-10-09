import Link from "next/link";
import {
  ArrowLeft,
  Play,
  Users,
  Wallet,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import { AppMockup } from "./app-mockup";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div className="absolute inset-0 -z-10">
        <div className="absolute right-1/4 top-0 h-72 w-72 rounded-full bg-primary/20 blur-3xl animate-float" />
        <div className="absolute left-1/4 top-1/3 h-72 w-72 rounded-full bg-accent/20 blur-3xl animate-float-slow" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-16 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-12">
          <div className="text-center lg:text-right">
            <h1 className="text-4xl font-extrabold leading-[1.15] tracking-tight sm:text-5xl xl:text-6xl">
              <span className="block bg-gradient-to-l from-primary via-accent to-primary bg-clip-text text-transparent">
                Edvora
              </span>
              <span className="mt-2 block text-foreground">دستیار هوشمند</span>
              <span className="block text-foreground">شخصی</span>
            </h1>

            <p className="mx-auto mt-6 max-w-lg text-base text-muted-foreground sm:text-lg lg:mx-0 lg:max-w-none">
              مدیریت شاگردها، ثبت جلسات، محاسبه خودکار شهریه و گزارش‌های مالی
              همه در یک اپ ساده و قدرتمند.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
              <Link
                href={ROUTES.REGISTER}
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "w-full sm:w-auto",
                )}
              >
                شروع رایگان
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <Link
                href="#how-it-works"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "w-full sm:w-auto",
                )}
              >
                <Play className="h-4 w-4" />
                مشاهده نحوه کار
              </Link>
            </div>
          </div>

          <div className="relative lg:pr-4">
            <div className="absolute -inset-8 -z-10 rounded-3xl bg-gradient-to-b from-primary/25 to-transparent blur-3xl" />

            <div className="relative">
              <AppMockup />

              <div className="pointer-events-none absolute -right-6 -top-6 hidden animate-float lg:block">
                <FloatingCard
                  icon={<Users className="h-4 w-4" />}
                  label="شاگردها"
                  value="۱۲ نفر"
                />
              </div>

              <div className="pointer-events-none absolute -bottom-6 -left-6 hidden animate-float-slow lg:block">
                <FloatingCard
                  icon={<Wallet className="h-4 w-4" />}
                  label="درآمد ماه"
                  value="۸.۴M"
                />
              </div>

              <div className="pointer-events-none absolute -left-4 top-1/3 hidden animate-float lg:block">
                <FloatingCard
                  icon={<TrendingUp className="h-4 w-4" />}
                  label="رشد"
                  value="+۲۳٪"
                  variant="success"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface FloatingCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  variant?: "default" | "success";
}

function FloatingCard({
  icon,
  label,
  value,
  variant = "default",
}: FloatingCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card/95 p-3 shadow-xl backdrop-blur">
      <div className="flex items-center gap-2.5">
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg",
            variant === "success"
              ? "bg-success/10 text-success"
              : "bg-primary/10 text-primary",
          )}
        >
          {icon}
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground">{label}</p>
          <p className="text-sm font-bold text-foreground">{value}</p>
        </div>
      </div>
    </div>
  );
}
