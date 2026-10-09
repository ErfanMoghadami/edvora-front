"use client";

import { useState } from "react";
import { Calendar, Plus, Trash2, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { ClientDate } from "@/components/shared/client-date";
import { cn, formatCurrency } from "@/lib/utils";
import {
  useDeleteSession,
  useDeletePayment,
  useStudentSessions,
} from "../hooks/use-student-sessions";
import { SessionFormDialog } from "./session-form-dialog";
import { PaymentFormDialog } from "./payment-form-dialog";
import type { Student } from "@/types/student";
import type { SessionStatus } from "@/types/session";

interface StudentSessionsSectionProps {
  student: Student;
}

const STATUS_STYLE: Record<
  SessionStatus,
  { label: string; className: string; icon: typeof CheckCircle2 }
> = {
  completed: {
    label: "برگزار شد",
    className: "bg-success/10 text-success",
    icon: CheckCircle2,
  },
  canceled: {
    label: "کنسل شد",
    className: "bg-destructive/10 text-destructive",
    icon: XCircle,
  },
  scheduled: {
    label: "برنامه‌ریزی شده",
    className: "bg-secondary text-secondary-foreground",
    icon: Clock,
  },
};

export function StudentSessionsSection({
  student,
}: StudentSessionsSectionProps) {
  const [sessionOpen, setSessionOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [paymentToDelete, setPaymentToDelete] = useState<string | null>(null);

  const { studentSessions, studentPayments, balance } = useStudentSessions(
    student.id
  );
  const deleteSession = useDeleteSession();
  const deletePayment = useDeletePayment();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">جلسات</CardTitle>
          <Button size="sm" onClick={() => setSessionOpen(true)} type="button">
            <Plus className="h-4 w-4" />
            ثبت جلسه
          </Button>
        </CardHeader>
        <CardContent>
          {studentSessions.length === 0 ? (
            <EmptyState
              icon={<Calendar className="h-6 w-6" />}
              title="هنوز جلسه‌ای ثبت نشده"
              description="اولین جلسه این شاگرد را ثبت کنید"
              className="py-8"
            />
          ) : (
            <div className="divide-y divide-border">
              {studentSessions.map((session) => {
                const style = STATUS_STYLE[session.status];
                const Icon = style.icon;
                return (
                  <div
                    key={session.id}
                    className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-lg",
                          style.className
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          <ClientDate date={session.date} />
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {style.label} — {session.duration} دقیقه
                          {session.note && ` — ${session.note}`}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSessionToDelete(session.id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      aria-label="حذف جلسه"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">پرداخت‌ها</CardTitle>
          <Button
            size="sm"
            onClick={() => setPaymentOpen(true)}
            type="button"
            variant="outline"
          >
            <Plus className="h-4 w-4" />
            ثبت پرداخت
          </Button>
        </CardHeader>
        <CardContent>
          {studentPayments.length === 0 ? (
            <EmptyState
              icon={<Calendar className="h-6 w-6" />}
              title="هنوز پرداختی ثبت نشده"
              description="اولین پرداخت این شاگرد را ثبت کنید"
              className="py-8"
            />
          ) : (
            <div className="divide-y divide-border">
              {studentPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div>
                    <p className="text-sm font-semibold text-success">
                      {formatCurrency(payment.amount)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      <ClientDate date={payment.date} />
                      {payment.note && ` — ${payment.note}`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPaymentToDelete(payment.id)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    aria-label="حذف پرداخت"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <SessionFormDialog
        open={sessionOpen}
        onClose={() => setSessionOpen(false)}
        student={student}
      />

      <PaymentFormDialog
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        student={student}
        suggestedAmount={balance?.remaining || undefined}
      />

      <ConfirmDialog
        open={!!sessionToDelete}
        onClose={() => setSessionToDelete(null)}
        onConfirm={() => {
          if (sessionToDelete) deleteSession(sessionToDelete);
        }}
        title="حذف جلسه"
        description="آیا مطمئنید که می‌خواهید این جلسه را حذف کنید؟ این عمل قابل بازگشت نیست."
        confirmLabel="حذف کن"
      />

      <ConfirmDialog
        open={!!paymentToDelete}
        onClose={() => setPaymentToDelete(null)}
        onConfirm={() => {
          if (paymentToDelete) deletePayment(paymentToDelete);
        }}
        title="حذف پرداخت"
        description="آیا مطمئنید که می‌خواهید این پرداخت را حذف کنید؟ این عمل قابل بازگشت نیست."
        confirmLabel="حذف کن"
      />
    </div>
  );
}