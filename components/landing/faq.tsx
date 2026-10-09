"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "Edvora برای چه کسانی مناسبه؟",
    answer:
      "Edvora برای هر آموزش‌دهنده‌ایه — از معلم خصوصی و استاد دانشگاه تا مربی باشگاه، معلم موسیقی و هر کسی که آموزش می‌ده. اگه با چند شاگرد یا هنرجو کار می‌کنی و از دفتر کاغذی یا اکسل خسته شدی، Edvora همه چی رو خودکار می‌کنه تا تو فقط روی آموزش تمرکز کنی.",
  },
//   {
//     question: "آیا واقعاً رایگانه؟",
//     answer:
//       "بله! پلن رایگان برای همیشه در دسترسه و تا ۵ شاگرد یا هنرجو رو پشتیبانی می‌کنه. برای بیشتر، می‌تونید به پلن حرفه‌ای با قیمت مناسب ارتقا بدید.",
//   },
  {
    question: "اطلاعات من امن هست؟",
    answer:
      "بله. اطلاعات شما روی سرورهای ایرانی و با رمزنگاری ذخیره می‌شه. ما هیچ‌وقت اطلاعات شما رو با کسی به اشتراک نمی‌گذاریم و در هر زمان که بخواهید می‌تونید کل حساب‌تون رو حذف کنید.",
  },
  {
    question: "می‌تونم لینک وضعیت شاگرد بفرستم؟",
    answer:
      "بله! برای هر شاگرد یا هنرجو یه لینک اختصاصی ساخته می‌شه که می‌تونید بهشون یا به خانواده‌شون بدید. اون‌ها بدون نیاز به ثبت‌نام، وضعیت جلسات و بدهیشون رو می‌بینن.",
  },
//   {
//     question: "چطور می‌تونم اشتراک بگیرم؟",
//     answer:
//       "از داخل پنل، بخش تنظیمات، پلن حرفه‌ای رو انتخاب می‌کنید و از طریق درگاه امن زرین‌پال پرداخت می‌کنید. اشتراک به‌صورت خودکار فعال می‌شه.",
//   },
//   {
//     question: "می‌تونم هر وقت خواستم لغو کنم؟",
//     answer:
//       "بله، هر زمان که بخواهید می‌تونید اشتراک رو لغو کنید. تا پایان دوره پرداخت‌شده، به همه امکانات دسترسی دارید و بعدش به پلن رایگان برمی‌گردید.",
//   },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="relative border-t border-border bg-muted/30 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            سوالات متداول
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            سوالی دارید؟
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            جواب سوالات رایج رو اینجا پیدا کنید.
          </p>
        </div>

        <div className="mt-12 space-y-3">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={item.question}
                className={cn(
                  "overflow-hidden rounded-xl border bg-card transition-colors",
                  isOpen ? "border-primary/40" : "border-border",
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-right transition-colors hover:bg-muted/50"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-semibold text-foreground sm:text-base">
                    {item.question}
                  </span>
                  <div
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-300",
                      isOpen
                        ? "rotate-45 bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    <Plus className="h-4 w-4" />
                  </div>
                </button>

                <div
                  className={cn(
                    "grid transition-all duration-300 ease-in-out",
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
