import { UserPlus, CalendarPlus, Wallet, LineChart } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  number: string;
  icon: typeof UserPlus;
  title: string;
  description: string;
  color: string;
}

const STEPS: Step[] = [
  {
    number: "۰۱",
    icon: UserPlus,
    title: "شاگرد رو اضافه کن",
    description:
      "نام، شماره، نرخ و الگوی کلاس رو وارد کن. فقط ۳۰ ثانیه وقت می‌گیره.",
    color: "text-blue-500",
  },
  {
    number: "۰۲",
    icon: CalendarPlus,
    title: "جلسات رو ثبت کن",
    description:
      "بعد از هر جلسه، با یک کلیک وضعیتش رو مشخص کن — برگزار شده یا کنسل.",
    color: "text-purple-500",
  },
  {
    number: "۰۳",
    icon: Wallet,
    title: "پرداخت‌ها رو وارد کن",
    description:
      "هر پرداختی که از شاگرد گرفتی، ثبت کن. بدهی خودکار محاسبه می‌شه.",
    color: "text-emerald-500",
  },
  {
    number: "۰۴",
    icon: LineChart,
    title: "گزارش بگیر",
    description:
      "درآمد ماهانه، بدهی معوق و روند رشد — همه در یه نگاه.",
    color: "text-amber-500",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative border-y border-border bg-muted/30 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            نحوه کار
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            در ۴ قدم ساده شروع کن
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            از ثبت‌نام تا اولین گزارش، کمتر از ۵ دقیقه.
          </p>
        </div>

        <div className="relative mt-16">
          <div className="absolute inset-x-0 top-6 hidden h-px bg-gradient-to-l from-transparent via-border to-transparent lg:block" />

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="relative">
                  <div className="mb-6 flex items-center gap-4 lg:flex-col lg:items-start lg:gap-0">
                    <div
                      className={cn(
                        "relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-border bg-card shadow-sm",
                        "lg:mb-4"
                      )}
                    >
                      <Icon
                        className={cn("h-5 w-5", step.color)}
                      />
                    </div>

                    <span className="text-sm font-bold tracking-widest text-muted-foreground lg:absolute lg:-top-2 lg:right-0 lg:text-xs">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="mb-2 text-base font-bold text-foreground">
                    {step.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>

                  {i < STEPS.length - 1 && (
                    <div className="mt-6 h-px bg-border sm:hidden" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-16 overflow-hidden rounded-2xl border border-border bg-card">
          <div className="grid gap-0 sm:grid-cols-3">
            {[
              { value: "۰", label: "کاغذ مورد نیاز" },
              { value: "۱۰۰٪", label: "خودکارسازی حساب‌ها" },
              { value: "۵ دقیقه", label: "زمان راه‌اندازی" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className={cn(
                  "p-8 text-center",
                  i < 2 && "border-b border-border sm:border-b-0 sm:border-l"
                )}
              >
                <p className="text-3xl font-extrabold text-primary sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}