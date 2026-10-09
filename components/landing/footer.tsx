import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { APP_NAME, ROUTES } from "@/lib/constants";

const FOOTER_LINKS = [
  {
    title: "محصول",
    links: [
      { label: "ویژگی‌ها", href: "#features" },
      { label: "نحوه کار", href: "#how-it-works" },
      { label: "قیمت", href: "#pricing" },
      { label: "سوالات متداول", href: "#faq" },
    ],
  },
  {
    title: "حساب",
    links: [
      { label: "ورود", href: ROUTES.LOGIN },
      { label: "ثبت‌نام", href: ROUTES.REGISTER },
      { label: "داشبورد", href: ROUTES.DASHBOARD },
    ],
  },
  {
    title: "درباره",
    links: [
      { label: "تماس با ما", href: "mailto:info@edvora.ir" },
      { label: "قوانین و مقررات", href: "/terms" },
      { label: "حریم خصوصی", href: "/privacy" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2 transition-opacity hover:opacity-80"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold text-foreground">
                {APP_NAME}
              </span>
            </Link>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              دستیار هوشمند. مدیریت شاگردها، جلسات و حساب‌ها —
              همه در یک اپ ساده.
            </p>
          </div>

          {FOOTER_LINKS.map((group) => (
            <div key={group.title}>
              <h3 className="mb-4 text-sm font-bold text-foreground">
                {group.title}
              </h3>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © ۱۴۰۴ {APP_NAME} — تمامی حقوق محفوظ است
          </p>

          <p className="text-xs text-muted-foreground">
            ساخته شده با ❤️ در ایران
          </p>
        </div>
      </div>
    </footer>
  );
}
