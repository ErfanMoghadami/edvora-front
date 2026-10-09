"use client";

import { useState } from "react";
import Link from "next/link";
import { Wallet, Trash2 } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { ClientDate } from "@/components/shared/client-date";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { formatCurrency, getInitials } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import { useDeletePayment } from "@/features/students/hooks/use-student-sessions";
import type { PaymentWithStudent } from "@/types/payment";

interface PaymentsListProps {
  payments: PaymentWithStudent[];
  hasAny: boolean;
}

const METHOD_LABEL: Record<string, string> = {
  cash: "نقدی",
  card: "کارت به کارت",
  transfer: "انتقال بانکی",
  other: "سایر",
};

export function PaymentsList({ payments, hasAny }: PaymentsListProps) {
  const deletePayment = useDeletePayment();
  const [toDelete, setToDelete] = useState<PaymentWithStudent | null>(null);

  function handleConfirmDelete() {
    if (toDelete) {
      deletePayment(toDelete.id);
    }
  }

  if (!hasAny) {
    return (
      <EmptyState
        icon={<Wallet className="h-8 w-8" />}
        title="هنوز پرداختی ثبت نشده"
        description="از صفحه شاگردها، اولین پرداخت را ثبت کنید"
      />
    );
  }

  if (payments.length === 0) {
    return (
      <EmptyState
        icon={<Wallet className="h-8 w-8" />}
        title="پرداختی پیدا نشد"
        description="فیلترها را تغییر دهید"
      />
    );
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border border-border bg-card lg:block">
        <div className="overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 z-10 bg-card/95 backdrop-blur">
              <tr className="border-b border-border text-xs font-medium text-muted-foreground">
                <th className="px-4 py-3 text-right font-medium">شاگرد</th>
                <th className="px-4 py-3 text-right font-medium">مبلغ</th>
                <th className="px-4 py-3 text-right font-medium">تاریخ</th>
                <th className="px-4 py-3 text-right font-medium">روش</th>
                <th className="px-4 py-3 text-right font-medium">یادداشت</th>
                <th className="w-16 px-4 py-3 text-left font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {payments.map((payment) => (
                <tr
                  key={payment.id}
                  className="group transition-colors hover:bg-muted/50"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`${ROUTES.STUDENTS}/${payment.studentId}`}
                      className="flex items-center gap-3"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                        {getInitials(payment.studentName)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                          {payment.studentName}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {payment.studentPhone}
                        </p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-bold text-success">
                      {formatCurrency(payment.amount)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-foreground">
                      <ClientDate date={payment.date} />
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-secondary-foreground">
                      {METHOD_LABEL[payment.method]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-muted-foreground">
                      {payment.note || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-left">
                    <button
                      type="button"
                      onClick={() => setToDelete(payment)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      aria-label="حذف پرداخت"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-3 lg:hidden">
        {payments.map((payment) => (
          <div
            key={payment.id}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <Link
                href={`${ROUTES.STUDENTS}/${payment.studentId}`}
                className="flex items-center gap-3"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                  {getInitials(payment.studentName)}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {payment.studentName}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    <ClientDate date={payment.date} /> —{" "}
                    {METHOD_LABEL[payment.method]}
                  </p>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => setToDelete(payment)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                aria-label="حذف پرداخت"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <span className="text-sm font-bold text-success">
                {formatCurrency(payment.amount)}
              </span>
              {payment.note && (
                <span className="max-w-[180px] truncate text-xs text-muted-foreground">
                  {payment.note}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="حذف پرداخت"
        description={
          toDelete
            ? `آیا مطمئنید که می‌خواهید پرداخت «${formatCurrency(
                toDelete.amount
              )}» از ${toDelete.studentName} را حذف کنید؟ این عمل قابل بازگشت نیست.`
            : ""
        }
        confirmLabel="حذف کن"
      />
    </>
  );
}