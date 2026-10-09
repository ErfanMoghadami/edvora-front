import Link from "next/link";
import { Check, Crown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";

interface Plan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  badge?: string;
}

const PLANS: Plan[] = [
  {
    name: "رایگان",
    price: "۰",
    period: "برای همیشه",
    description: "برای شروع و آشنایی با Edvora",
    features: [
      "تا ۵ شاگرد",
      "ثبت جلسات نامحدود",
      "محاسبه خودکار شهریه",
      "لینک اشتراکی شاگرد",
    ],
    cta: "شروع رایگان",
  },
  {
    name: "حرفه‌ای",
    price: "۲۰۰,۰۰۰",
    period: "تومان / ماهانه",
    description: "برای معلم‌های جدی و حرفه‌ای",
    features: [
      "شاگرد نامحدود",
      "همه امکانات رایگان",
      "گزارش‌های مالی پیشرفته",
      "خروجی PDF و Excel",
      "یادآوری خودکار پرداخت",
      "پشتیبانی اولویت‌دار",
    ],
    cta: "ارتقا به حرفه‌ای",
    highlighted: true,
    badge: "پیشنهاد ویژه",
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            قیمت‌گذاری
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            ساده، شفاف، بدون دردسر
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            برای شروع رایگان شروع کن. هر وقت خواستی ارتقا بده.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-3xl gap-6 lg:grid-cols-2">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative flex flex-col rounded-2xl border bg-card p-6 transition-all duration-300 sm:p-8",
                plan.highlighted
                  ? "border-primary/50 shadow-lg shadow-primary/10"
                  : "border-border"
              )}
            >
              {plan.badge && (
                <div className="absolute -top-3 right-6 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[10px] font-bold text-primary-foreground">
                  <Sparkles className="h-3 w-3" />
                  {plan.badge}
                </div>
              )}

              <div className="mb-6">
                <div className="flex items-center gap-2">
                  {plan.highlighted && (
                    <Crown className="h-4 w-4 text-primary" />
                  )}
                  <h3 className="text-lg font-bold text-foreground">
                    {plan.name}
                  </h3>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {plan.description}
                </p>
              </div>

              <div className="mb-6 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-foreground sm:text-4xl">
                  {plan.price}
                </span>
                <span className="text-sm text-muted-foreground">
                  {plan.period}
                </span>
              </div>

              <ul className="mb-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <div
                      className={cn(
                        "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
                        plan.highlighted
                          ? "bg-primary/15 text-primary"
                          : "bg-success/15 text-success"
                      )}
                    >
                      <Check className="h-2.5 w-2.5" strokeWidth={3} />
                    </div>
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={ROUTES.REGISTER}
                className={cn(
                  buttonVariants({
                    variant: plan.highlighted ? "default" : "outline",
                    size: "lg",
                  }),
                  "w-full"
                )}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          پرداخت امن با درگاه زرین‌پال • لغو در هر زمان • بدون هزینه پنهان
        </p>
      </div>
    </section>
  );
}