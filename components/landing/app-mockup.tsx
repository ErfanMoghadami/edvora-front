import {
  LayoutDashboard,
  Users,
  Calendar,
  Wallet,
  Settings,
  TrendingUp,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function AppMockup({ className }: { className?: string }) {
  const navItems = [
    { icon: LayoutDashboard, label: "داشبورد", active: true },
    { icon: Users, label: "شاگردها" },
    { icon: Calendar, label: "جلسات" },
    { icon: Wallet, label: "پرداخت‌ها" },
    { icon: Settings, label: "تنظیمات" },
  ];

  const stats = [
    { label: "کل شاگردها", value: "۱۲ نفر" },
    { label: "جلسات ماه", value: "۴۸" },
    { label: "درآمد ماه", value: "۸.۴ میلیون" },
  ];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xl",
        className,
      )}
      dir="rtl"
    >
      <div className="flex items-center gap-1.5 border-b border-border bg-muted/40 px-3 py-2.5">
        <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
        <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
        <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
        <div className="mx-auto rounded-md bg-background px-3 py-1 text-[10px] text-muted-foreground">
          edvora.ir/dashboard
        </div>
      </div>

      <div className="flex h-[340px]">
        <aside className="hidden w-40 shrink-0 border-l border-border bg-card p-3 sm:block">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GraduationCap className="h-3.5 w-3.5" />
            </div>
            <span className="text-xs font-bold text-foreground">Edvora</span>
          </div>
          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-2 py-1.5 text-[11px]",
                    item.active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="font-medium">{item.label}</span>
                </div>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 space-y-3 p-4">
          <div>
            <p className="text-sm font-bold text-foreground">
              خوش آمدید 👋
            </p>
            <p className="mt-0.5 text-[10px] text-muted-foreground">
              خلاصه‌ای از وضعیت مالی شما
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border border-border bg-background p-2"
              >
                <p className="text-[9px] text-muted-foreground">{stat.label}</p>
                <p className="mt-1 text-xs font-bold text-foreground">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-border bg-background p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[11px] font-semibold text-foreground">
                درآمد ۶ ماه اخیر
              </p>
              <div className="flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5">
                <TrendingUp className="h-2.5 w-2.5 text-success" />
                <span className="text-[9px] font-medium text-success">
                  +۲۳٪
                </span>
              </div>
            </div>
            <div className="flex h-16 items-end justify-between gap-1.5">
              {[40, 55, 35, 70, 85, 95].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm bg-gradient-to-t from-primary/30 to-primary"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-background p-2">
            <p className="mb-1.5 text-[11px] font-semibold text-foreground">
              آخرین جلسات
            </p>
            {["علی رضایی", "سارا محمدی"].map((name) => (
              <div
                key={name}
                className="flex items-center justify-between border-t border-border py-1.5 first:border-t-0"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[8px] font-bold text-secondary-foreground">
                    {name.charAt(0)}
                  </div>
                  <span className="text-[10px] text-foreground">{name}</span>
                </div>
                <span className="text-[9px] text-muted-foreground">
                  برگزار شد
                </span>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
