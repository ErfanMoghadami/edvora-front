"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { GraduationCap, UserX } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ClientDate } from "@/components/shared/client-date";
import { getSharedDataApi } from "../api/share-api";
import { calculateBalance } from "@/features/students/lib/balance";
import { calculateFinancials } from "@/features/students/lib/calculations";
import { APP_NAME } from "@/lib/constants";
import { cn, formatCurrency, getInitials } from "@/lib/utils";

export function ShareView() {
  const params = useParams();
  const token = params.token as string;

  const query = useQuery({
    queryKey: ["share", token],
    queryFn: () => getSharedDataApi(token),
    enabled: !!token,
    retry: false,
  });

  if (query.isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 p-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (query.isError || !query.data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
          <UserX className="h-10 w-10" />
        </div>
        <h1 className="mb-3 text-xl font-semibold text-foreground">
          اطلاعات یافت نشد
        </h1>
        <p className="max-w-md text-sm text-muted-foreground">
          لینک اشتراک‌گذاری نامعتبر است یا این شاگرد حذف شده است.
        </p>
      </div>
    );
  }

  const { student, sessions, payments } = query.data;
  const fin = calculateFinancials(student);
  const balance = calculateBalance(student, sessions, payments);

  const studentSessions = [...sessions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const studentPayments = [...payments].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4 sm:px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">{APP_NAME}</p>
            <p className="text-xs text-muted-foreground">گزارش وضعیت شاگرد</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 p-4 sm:p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-lg font-bold text-secondary-foreground">
            {getInitials(student.name)}
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground sm:text-2xl">
              {student.name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {student.phone}
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-xs font-medium text-muted-foreground">
                مبلغ ماهانه
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base font-bold text-foreground">
                {formatCurrency(fin.monthlyAmount)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xs font-medium text-muted-foreground">
                پرداخت شده
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base font-bold text-success">
                {formatCurrency(balance.totalPaid)}
              </p>
            </CardContent>
          </Card>

          <Card
            className={cn(
              balance.remaining > 0
                ? "border-destructive/30 bg-destructive/5"
                : "border-success/30 bg-success/5"
            )}
          >
            <CardHeader>
              <CardTitle className="text-xs font-medium text-muted-foreground">
                مانده بدهی
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className={cn(
                  "text-base font-bold",
                  balance.remaining > 0 ? "text-destructive" : "text-success"
                )}
              >
                {balance.remaining > 0
                  ? formatCurrency(balance.remaining)
                  : "تسویه شده"}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              جلسات ({balance.completedSessions} برگزار شده)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {studentSessions.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                هنوز جلسه‌ای ثبت نشده
              </p>
            ) : (
              <div className="divide-y divide-border">
                {studentSessions.slice(0, 10).map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between py-2.5 text-sm first:pt-0 last:pb-0"
                  >
                    <span className="text-foreground">
                      <ClientDate date={session.date} />
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {session.status === "completed"
                        ? "برگزار شد"
                        : session.status === "canceled"
                        ? "کنسل شد"
                        : "برنامه‌ریزی شده"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">پرداخت‌ها</CardTitle>
          </CardHeader>
          <CardContent>
            {studentPayments.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                هنوز پرداختی ثبت نشده
              </p>
            ) : (
              <div className="divide-y divide-border">
                {studentPayments.slice(0, 10).map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between py-2.5 text-sm first:pt-0 last:pb-0"
                  >
                    <span className="font-semibold text-success">
                      {formatCurrency(payment.amount)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      <ClientDate date={payment.date} />
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          این گزارش به صورت خودکار توسط {APP_NAME} تولید شده است
        </p>
      </main>
    </div>
  );
}