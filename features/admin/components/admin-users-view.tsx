"use client";

import { useState } from "react";
import { Search, Users as UsersIcon, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/shared/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useAdminUsers } from "../hooks/use-admin";
import { UserRow } from "./user-row";
import type { ListUsersParams } from "../api/admin-api";

const FILTERS: {
  value: NonNullable<ListUsersParams["filter"]>;
  label: string;
}[] = [
  { value: "all", label: "همه" },
  { value: "active", label: "فعال" },
  { value: "suspended", label: "تعلیق‌شده" },
  { value: "admins", label: "ادمین‌ها" },
];

export function AdminUsersView() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<NonNullable<ListUsersParams["filter"]>>(
    "all"
  );

  const { data, isLoading, isError, refetch } = useAdminUsers({
    search: search.trim() || undefined,
    filter,
    limit: 50,
  });

  const users = data?.users ?? [];
  const total = data?.pagination.total ?? 0;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <PageHeader
        title="کاربران"
        description={
          total > 0
            ? `${total} کاربر ثبت‌شده در Edvora`
            : "کاربران پلتفرم"
        }
      />

      <div className="space-y-4">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="جستجو بر اساس نام یا شماره..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-9"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="پاک کردن"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={cn(
                "h-9 shrink-0 rounded-lg border px-4 text-xs font-medium transition-colors",
                filter === f.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground hover:bg-muted"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : users.length === 0 ? (
        <EmptyState
          icon={<UsersIcon className="h-8 w-8" />}
          title={search ? "کاربری پیدا نشد" : "هنوز کاربری ثبت نشده"}
          description={
            search
              ? "عبارت جستجو را تغییر دهید یا فیلتر را عوض کنید"
              : "وقتی کاربران ثبت‌نام کنند، اینجا نمایش داده می‌شوند"
          }
        />
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <UserRow key={user.id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
}