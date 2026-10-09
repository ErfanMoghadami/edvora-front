"use client";

import Link from "next/link";
import { ShieldCheck, Ban, User as UserIcon, Eye } from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import { ClientDate } from "@/components/shared/client-date";
import type { AdminUser } from "../api/admin-api";

interface UserRowProps {
  user: AdminUser;
}

export function UserRow({ user }: UserRowProps) {
  const displayPhone = user.phone.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

  return (
    <Link
      href={`/admin/users/${user.id}`}
      className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-md sm:p-5"
    >
      <div className="relative">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground">
          {getInitials(user.name)}
        </div>
        {user.isSuspended && (
          <div className="absolute -bottom-0.5 -left-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-card bg-destructive text-destructive-foreground">
            <Ban className="h-2.5 w-2.5" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
            {user.name}
          </p>
          {user.isAdmin && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
              <ShieldCheck className="h-3 w-3" />
              ادمین
            </span>
          )}
          {user.isSuspended && (
            <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-medium text-destructive">
              <Ban className="h-3 w-3" />
              تعلیق‌شده
            </span>
          )}
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <UserIcon className="h-3 w-3" />
            {displayPhone}
          </span>
          <span>ثبت‌نام: <ClientDate date={user.createdAt} /></span>
        </div>
      </div>

      <div className="hidden text-left sm:block">
        <p className="text-[10px] text-muted-foreground">آخرین ورود</p>
        <p className="mt-0.5 text-xs text-foreground">
          {user.lastLoginAt ? (
            <ClientDate date={user.lastLoginAt} />
          ) : (
            "—"
          )}
        </p>
      </div>

      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors",
          "group-hover:bg-primary/10 group-hover:text-primary"
        )}
      >
        <Eye className="h-4 w-4" />
      </div>
    </Link>
  );
}