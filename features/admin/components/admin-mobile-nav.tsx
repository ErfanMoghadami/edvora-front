"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Menu,
  X,
  ShieldCheck,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_NAME, ROUTES } from "@/lib/constants";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
}

const ITEMS: NavItem[] = [
  {
    label: "داشبورد ادمین",
    href: "/admin",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "کاربران",
    href: "/admin/users",
    icon: Users,
  },
];

const ANIMATION_DURATION = 250;

export function AdminMobileNav() {
  const [open, setOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  function handleClose() {
    if (isClosing) return;
    setIsClosing(true);
    window.setTimeout(() => {
      setOpen(false);
      setIsClosing(false);
    }, ANIMATION_DURATION);
  }

  const isVisible = open || isClosing;

  const drawer =
    isVisible && mounted
      ? createPortal(
          <>
            <div
              className={cn(
                "fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm lg:hidden",
                isClosing ? "animate-fade-out" : "animate-fade-in",
              )}
              onClick={handleClose}
              aria-hidden="true"
            />

            <aside
              className={cn(
                "fixed right-0 top-0 z-[70] flex h-screen w-72 max-w-[85vw] flex-col border-l border-border bg-card shadow-2xl lg:hidden",
                isClosing
                  ? "animate-slide-out-right"
                  : "animate-slide-in-right",
              )}
              role="dialog"
              aria-modal="true"
              aria-label="منوی مدیریت"
            >
              <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
                <Link
                  href="/admin"
                  className="flex items-center gap-2"
                  onClick={handleClose}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive text-destructive-foreground">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-foreground">
                      {APP_NAME}
                    </span>
                    <span className="block text-[10px] text-muted-foreground">
                      پنل مدیریت
                    </span>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={handleClose}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label="بستن منو"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <nav className="flex flex-col gap-1">
                  {ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.exact
                      ? pathname === item.href
                      : pathname === item.href ||
                        pathname.startsWith(item.href + "/");

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={handleClose}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                          isActive
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        )}
                      >
                        <Icon className="h-5 w-5 shrink-0" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="border-t border-border p-4">
                <Link
                  href={ROUTES.DASHBOARD}
                  onClick={handleClose}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                  <span>بازگشت به اپ اصلی</span>
                </Link>
              </div>
            </aside>
          </>,
          document.body,
        )
      : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
        aria-label="باز کردن منوی مدیریت"
      >
        <Menu className="h-5 w-5" />
      </button>
      {drawer}
    </>
  );
}
