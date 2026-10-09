"use client";

import {
  Users,
  UserCheck,
  UserX,
  GraduationCap,
  Calendar,
  Wallet,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatNumber } from "@/lib/utils";
import { useAdminStats } from "../hooks/use-admin";

export function AdminDashboard() {
  const { data, isLoading, isError, refetch } = useAdminStats();

  if (isLoading) {
    return <AdminDashboardSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="p-4 sm:p-6">
        <ErrorState onRetry={() => refetch()} />
      </div>
    );
  }

  const mainStats = [
    {
      label: "کل کاربران",
      value: formatNumber(data.users.total),
      icon: Users,
      color: "text-primary",
      bg: "bg-primary/10",
      sub: `${formatNumber(data.users.newThisMonth)} کاربر جدید این ماه`,
    },
    {
      label: "فعال امروز",
      value: formatNumber(data.users.activeToday),
      icon: UserCheck,
      color: "text-success",
      bg: "bg-success/10",
      sub: `${formatNumber(data.users.activeThisWeek)} فعال این هفته`,
    },
    {
      label: "تعلیق‌شده",
      value: formatNumber(data.users.suspended),
      icon: UserX,
      color: "text-destructive",
      bg: "bg-destructive/10",
      sub: "کاربران غیرفعال",
    },
    {
      label: "کاربران جدید",
      value: formatNumber(data.users.newThisWeek),
      icon: TrendingUp,
      color: "text-accent",
      bg: "bg-accent/10",
      sub: "در ۷ روز گذشته",
    },
  ];

  const contentStats = [
    {
      label: "شاگردها",
      value: formatNumber(data.students.total),
      icon: GraduationCap,
      color: "text-primary",
    },
    {
      label: "جلسات",
      value: formatNumber(data.sessions.total),
      icon: Calendar,
      color: "text-purple-500",
    },
    {
      label: "پرداخت‌ها",
      value: formatNumber(data.payments.total),
      icon: Wallet,
      color: "text-success",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <PageHeader
        title="داشبورد مدیریت"
        description="خلاصه‌ای از وضعیت کلی پلتفرم Edvora"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {mainStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="mt-2 text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                      stat.bg
                    )}
                  >
                    <Icon className={cn("h-5 w-5", stat.color)} />
                  </div>
                </div>
                <p className="mt-3 text-[11px] text-muted-foreground">
                  {stat.sub}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">محتوای پلتفرم</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {contentStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="flex items-center gap-4 rounded-xl border border-border p-4"
                >
                  <div
                    className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted",
                      stat.color
                    )}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="mt-1 text-xl font-bold text-foreground">
                      {stat.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AdminDashboardSkeleton() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="space-y-3 rounded-xl border border-border p-5"
          >
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border p-6">
        <Skeleton className="mb-4 h-5 w-32" />
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}