"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ArrowRight,
  ShieldCheck,
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

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-l lg:border-border lg:bg-card">
      <div className="flex h-16 items-center gap-3 border-b border-border px-6">
        <Link
          href="/admin"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
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
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <nav className="flex flex-col gap-1">
          {ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 shrink-0 transition-transform duration-200",
                    !isActive && "group-hover:scale-110"
                  )}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-border p-4">
        <Link
          href={ROUTES.DASHBOARD}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowRight className="h-3.5 w-3.5" />
          <span>بازگشت به اپ اصلی</span>
        </Link>
      </div>
    </aside>
  );
}