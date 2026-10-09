"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GraduationCap, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { APP_NAME, ROUTES } from "@/lib/constants";
import { useAuthStore } from "@/stores/auth-store";

const NAV_ITEMS = [
  { label: "ویژگی‌ها", href: "#features" },
  { label: "نحوه کار", href: "#how-it-works" },
//   { label: "قیمت", href: "#pricing" },
  { label: "سوالات", href: "#faq" },
];

export function LandingNavbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border bg-background/80 backdrop-blur-lg"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="text-base font-bold text-foreground">
            {APP_NAME}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.LOGIN}
            className={cn(
              buttonVariants({ variant: "default", size: "sm" }),
              "hidden sm:inline-flex",
            )}
          >
            {isAuthenticated ? "داشبورد" : "ورود"}
          </Link>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted md:hidden"
            aria-label="منو"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background p-4 md:hidden animate-slide-down">
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                {item.label}
              </a>
            ))}
            <Link
              href={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.LOGIN}
              className={cn(buttonVariants({ size: "lg" }), "mt-3 w-full")}
            >
              {isAuthenticated ? "داشبورد" : "ورود / ثبت‌نام"}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
