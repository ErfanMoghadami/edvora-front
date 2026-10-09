import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";

export function CTA() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-bl from-primary/15 via-primary/5 to-accent/10 p-8 text-center sm:p-14">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />

          <div className="relative">
            {/* <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-background/60 px-4 py-1.5 text-xs font-medium text-primary backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              <span>۷ روز آزمایش رایگان</span>
            </div> */}

            <h2 className="mx-auto max-w-2xl text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl">
              همین الان شروع کن
              <br />
              <span className="bg-gradient-to-l from-primary to-accent bg-clip-text text-transparent">
                روی آموزش تمرکز کن
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-lg text-base text-muted-foreground">
              دیگه نگران حساب و کتاب نباش. Edvora کارهای تکراری رو انجام می‌ده
              تا تو فقط به آموزش دادن فکر کنی.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
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
                href={ROUTES.LOGIN}
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "w-full sm:w-auto",
                )}
              >
                قبلاً ثبت‌نام کردید؟
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
