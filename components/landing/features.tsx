import {
  Users,
  Calendar,
  Wallet,
  Share2,
  BarChart3,
  Bell,
  type LucideIcon,
} from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
    {
    icon: Users,
    title: "مدیریت شاگردها و دانشجویان",
    description:
      "اطلاعات کامل هر شاگرد یا هنرجو، الگوی جلسه، نرخ و تاریخ شروع — همه در یک پروفایل منظم.",
  },
  {
    icon: Calendar,
    title: "ثبت جلسات",
    description:
      "با تقویم شمسی، جلسات رو ثبت کنید. برگزار شده، کنسل شده یا برنامه‌ریزی شده.",
  },
  {
    icon: Wallet,
    title: "محاسبه خودکار شهریه",
    description:
      "نرخ ساعتی یا جلسه‌ای، هفتگی یا ماهانه — سیستم خودش حساب می‌کند.",
  },
  {
    icon: BarChart3,
    title: "گزارش‌های مالی",
    description: "بدهی هر شاگرد، مجموع دریافتی و مانده — همیشه به‌روز و دقیق.",
  },
  {
    icon: Share2,
    title: "لینک اشتراکی شاگرد",
    description: "یک لینک اختصاصی به هر شاگرد بدهید تا وضعیت خودش را ببیند.",
  },
  {
    icon: Bell,
    title: "یادآوری هوشمند",
    description: "پیگیری پرداخت‌ها و جلسات معوق با یک کلیک، بدون فراموشی.",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            ویژگی‌ها
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            هر چیزی که یک معلم و یا مربی نیاز داره
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            از معلم خصوصی و استاد تا مربی و مدرس — بدون کاغذ، بدون اکسل، بدون
            فراموشی.
          </p>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-lg"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="mb-2 text-base font-bold text-foreground">
                    {feature.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
