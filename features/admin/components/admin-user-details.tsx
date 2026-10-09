"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Ban,
  UserCheck,
  UserX,
  LogIn,
  Trash2,
  Save,
  GraduationCap,
  Calendar,
  Wallet,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { ClientDate } from "@/components/shared/client-date";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatCurrency, formatNumber, getInitials } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import {
  useAdminUserDetails,
  useDeleteAdminUser,
  useImpersonate,
  useUpdateAdminUser,
} from "../hooks/use-admin";
import { useAuthStore } from "@/stores/auth-store";

export function AdminUserDetails() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data, isLoading, isError, refetch } = useAdminUserDetails(id);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-4 sm:p-6">
        <ErrorState onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6">
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowRight className="h-3 w-3" />
        بازگشت به کاربران
      </Link>

      <UserHeader user={data.user} />

      <StatsGrid stats={data.stats} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <AdminNoteCard
          userId={data.user.id}
          initialNote={data.user.adminNote ?? ""}
        />
        <ActionsCard
          userId={data.user.id}
          isAdmin={data.user.isAdmin}
          isSuspended={data.user.isSuspended}
          onDelete={() => router.push("/admin/users")}
        />
      </div>

      {data.recentStudents.length > 0 && (
        <RecentStudentsCard students={data.recentStudents} />
      )}
    </div>
  );
}

// ============ Sub Components ============

interface UserHeaderProps {
  user: {
    id: string;
    name: string;
    phone: string;
    isAdmin: boolean;
    isSuspended: boolean;
    lastLoginAt: string | null;
    loginCount: number;
    createdAt: string;
  };
}

function UserHeader({ user }: UserHeaderProps) {
  const displayPhone = user.phone.replace(
    /\d/g,
    (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]
  );

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="relative mx-auto sm:mx-0">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-secondary text-2xl font-bold text-secondary-foreground">
              {getInitials(user.name)}
            </div>
            {user.isSuspended && (
              <div className="absolute -bottom-1 -left-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-card bg-destructive text-destructive-foreground">
                <Ban className="h-3.5 w-3.5" />
              </div>
            )}
          </div>

          <div className="flex-1 text-center sm:text-right">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <h1 className="text-xl font-bold text-foreground sm:text-2xl">
                {user.name}
              </h1>
              {user.isAdmin && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
                  <ShieldCheck className="h-3 w-3" />
                  ادمین
                </span>
              )}
              {user.isSuspended && (
                <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-1 text-[11px] font-medium text-destructive">
                  <Ban className="h-3 w-3" />
                  تعلیق‌شده
                </span>
              )}
            </div>

            <p className="mt-2 text-sm text-muted-foreground">
              {displayPhone}
            </p>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-[11px] text-muted-foreground sm:justify-start">
              <span>
                ثبت‌نام: <ClientDate date={user.createdAt} />
              </span>
              <span>
                آخرین ورود:{" "}
                {user.lastLoginAt ? (
                  <ClientDate date={user.lastLoginAt} />
                ) : (
                  "—"
                )}
              </span>
              <span>تعداد ورود: {formatNumber(user.loginCount)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface StatsGridProps {
  stats: {
    studentsCount: number;
    sessionsCount: number;
    paymentsCount: number;
    totalRevenue: number;
  };
}

function StatsGrid({ stats }: StatsGridProps) {
  const items = [
    {
      label: "شاگردها",
      value: formatNumber(stats.studentsCount),
      icon: GraduationCap,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "جلسات",
      value: formatNumber(stats.sessionsCount),
      icon: Calendar,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      label: "پرداخت‌ها",
      value: formatNumber(stats.paymentsCount),
      icon: Wallet,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      label: "مجموع دریافتی",
      value: formatCurrency(stats.totalRevenue),
      icon: TrendingUp,
      color: "text-accent",
      bg: "bg-accent/10",
      full: true,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.label}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="mt-2 text-lg font-bold text-foreground">
                    {item.value}
                  </p>
                </div>
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                    item.bg
                  )}
                >
                  <Icon className={cn("h-5 w-5", item.color)} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// ============ Admin Note ============

interface AdminNoteCardProps {
  userId: string;
  initialNote: string;
}

function AdminNoteCard({ userId, initialNote }: AdminNoteCardProps) {
  const [note, setNote] = useState(initialNote);
  const update = useUpdateAdminUser();

  const isDirty = note !== initialNote;

  async function handleSave() {
    await update.mutateAsync({
      id: userId,
      data: { adminNote: note },
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">یادداشت پشتیبانی</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="یادداشت داخلی درباره این کاربر (فقط برای ادمین قابل مشاهده است)..."
          rows={5}
          className={cn(
            "w-full resize-none rounded-lg border border-border bg-background p-3 text-sm text-foreground",
            "placeholder:text-muted-foreground",
            "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          )}
        />
        <Button
          onClick={handleSave}
          disabled={!isDirty}
          loading={update.isPending}
          size="sm"
          className="w-full sm:w-auto"
        >
          <Save className="h-4 w-4" />
          ذخیره یادداشت
        </Button>
      </CardContent>
    </Card>
  );
}

// ============ Actions ============

interface ActionsCardProps {
  userId: string;
  isAdmin: boolean;
  isSuspended: boolean;
  onDelete: () => void;
}

function ActionsCard({
  userId,
  isAdmin,
  isSuspended,
  onDelete,
}: ActionsCardProps) {
  const update = useUpdateAdminUser();
  const deleteUser = useDeleteAdminUser();
  const impersonate = useImpersonate();
  const currentUser = useAuthStore((s) => s.user);
  const setAuth = useAuthStore((s) => s.setAuth);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmSuspend, setConfirmSuspend] = useState(false);
  const [confirmAdmin, setConfirmAdmin] = useState(false);

  const isMe = currentUser?.id === userId;

  async function handleSuspend() {
    await update.mutateAsync({
      id: userId,
      data: { isSuspended: !isSuspended },
    });
  }

  async function handleToggleAdmin() {
    await update.mutateAsync({
      id: userId,
      data: { isAdmin: !isAdmin },
    });
  }

  async function handleImpersonate() {
    const result = await impersonate.mutateAsync(userId);
    setAuth(
      {
        id: result.user.id,
        name: result.user.name,
        phone: result.user.phone,
        createdAt: result.user.createdAt,
        isAdmin: result.user.isAdmin,
      },
      result.token
    );
    window.location.href = ROUTES.DASHBOARD;
  }

  async function handleDelete() {
    await deleteUser.mutateAsync(userId);
    onDelete();
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">عملیات</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            onClick={handleImpersonate}
            loading={impersonate.isPending}
            disabled={isSuspended || isMe}
            className="w-full justify-start"
            type="button"
          >
            <LogIn className="h-4 w-4" />
            ورود به عنوان این کاربر
          </Button>

          <Button
            variant="outline"
            onClick={() => setConfirmSuspend(true)}
            disabled={isMe}
            className="w-full justify-start"
            type="button"
          >
            {isSuspended ? (
              <>
                <UserCheck className="h-4 w-4" />
                فعال‌سازی حساب
              </>
            ) : (
              <>
                <UserX className="h-4 w-4" />
                تعلیق حساب
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={() => setConfirmAdmin(true)}
            disabled={isMe}
            className="w-full justify-start"
            type="button"
          >
            <ShieldCheck className="h-4 w-4" />
            {isAdmin ? "حذف دسترسی ادمین" : "ارتقا به ادمین"}
          </Button>

          <Button
            variant="destructive"
            onClick={() => setConfirmDelete(true)}
            disabled={isMe}
            className="w-full justify-start"
            type="button"
          >
            <Trash2 className="h-4 w-4" />
            حذف کامل کاربر
          </Button>

          {isMe && (
            <div className="mt-3 flex items-start gap-2 rounded-lg bg-warning/10 p-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
              <p className="text-[11px] text-muted-foreground">
                نمی‌توانید روی حساب خودتان عملیات انجام دهید.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmSuspend}
        onClose={() => setConfirmSuspend(false)}
        onConfirm={handleSuspend}
        title={isSuspended ? "فعال‌سازی حساب" : "تعلیق حساب"}
        description={
          isSuspended
            ? "آیا مطمئنید که می‌خواهید این کاربر را فعال کنید؟"
            : "آیا مطمئنید که می‌خواهید این کاربر را تعلیق کنید؟ او نمی‌تواند وارد شود."
        }
        confirmLabel={isSuspended ? "فعال کن" : "تعلیق کن"}
        variant={isSuspended ? "default" : "destructive"}
      />

      <ConfirmDialog
        open={confirmAdmin}
        onClose={() => setConfirmAdmin(false)}
        onConfirm={handleToggleAdmin}
        title={isAdmin ? "حذف دسترسی ادمین" : "ارتقا به ادمین"}
        description={
          isAdmin
            ? "آیا مطمئنید که می‌خواهید دسترسی ادمین را از این کاربر بگیرید؟"
            : "آیا مطمئنید که می‌خواهید این کاربر را ادمین کنید؟"
        }
        confirmLabel="تأیید"
        variant="default"
      />

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        title="حذف کامل کاربر"
        description="آیا مطمئنید؟ تمام داده‌های این کاربر (شاگردها، جلسات، پرداخت‌ها) برای همیشه حذف می‌شود."
        confirmLabel="حذف کن"
      />
    </>
  );
}

// ============ Recent Students ============

interface RecentStudentsCardProps {
  students: Array<{
    id: string;
    name: string;
    phone: string;
    createdAt: string;
  }>;
}

function RecentStudentsCard({ students }: RecentStudentsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          آخرین شاگردهای این کاربر
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-border">
          {students.map((student) => (
            <div
              key={student.id}
              className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                  {getInitials(student.name)}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {student.name}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {student.phone}
                  </p>
                </div>
              </div>
              <ClientDate date={student.createdAt} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}