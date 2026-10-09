"use client";

import { useEffect, useRef, useState } from "react";
import { LogOut, User as UserIcon, Settings } from "lucide-react";
import Link from "next/link";
import { cn, getInitials } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import { useAuthStore } from "@/stores/auth-store";
import { useLogout } from "@/features/auth/hooks/use-auth";
import { InstallButton } from "../pwa/install-button";

export function UserMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKey);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  if (!user) {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
      </div>
    );
  }

  const displayPhone = user.phone
    ? user.phone.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)])
    : "";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex items-center gap-2 rounded-lg p-1 transition-colors",
          "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          open && "bg-muted",
        )}
        aria-label="منوی کاربر"
        aria-expanded={open}
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
          {getInitials(user.name)}
        </div>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-64 origin-top-left animate-slide-down rounded-xl border border-border bg-card p-2 shadow-lg">
          <div className="border-b border-border p-3">
            <p className="truncate text-sm font-semibold text-foreground">
              {user.name}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{displayPhone}</p>
          </div>

          <div className="mt-1 space-y-1">
            <Link
              href={ROUTES.SETTINGS}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
            >
              <UserIcon className="h-4 w-4" />
              <span>پروفایل</span>
            </Link>

            <Link
              href={ROUTES.SETTINGS}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
            >
              <Settings className="h-4 w-4" />
              <span>تنظیمات</span>
            </Link>
            <InstallButton variant="menu" onAfterClick={() => setOpen(false)} />
          </div>

          <div className="mt-1 border-t border-border pt-1">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                logout();
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              <span>خروج از حساب</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
