"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { ErrorState } from "@/components/shared/error-state";
import { PaymentsSkeleton } from "@/components/skeletons/payments-skeleton";
import { useStudents } from "@/features/students/hooks/use-students";
import { formatCurrency } from "@/lib/utils";
import { useAllPayments } from "../hooks/use-all-payments";
import { PaymentsFilters } from "./payments-filters";
import { PaymentsList } from "./payments-list";
import type { PaymentFilters } from "@/types/payment";

const INITIAL_FILTERS: PaymentFilters = {
  method: "all",
  studentId: "all",
  fromDate: "",
  toDate: "",
};

export function PaymentsView() {
  const [filters, setFilters] = useState<PaymentFilters>(INITIAL_FILTERS);
  const { students } = useStudents();
  const { payments, totalCount, totalAmount, isLoading, isError, refetch } =
    useAllPayments(filters);

  function resetFilters() {
    setFilters(INITIAL_FILTERS);
  }

  if (isLoading) return <PaymentsSkeleton />;

  if (isError) {
    return (
      <div className="p-4 sm:p-6">
        <ErrorState onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <PageHeader
        title="پرداخت‌ها"
        description="همه پرداخت‌های ثبت‌شده در یک نگاه"
      />

      {totalCount > 0 && (
        <Card className="border-success/30 bg-success/5">
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground">
              مجموع پرداخت‌های فیلترشده
            </p>
            <p className="mt-1 text-2xl font-bold text-success">
              {formatCurrency(totalAmount)}
            </p>
          </CardContent>
        </Card>
      )}

      {totalCount > 0 && (
        <PaymentsFilters
          filters={filters}
          onChange={setFilters}
          students={students}
          onReset={resetFilters}
        />
      )}

      <PaymentsList payments={payments} hasAny={totalCount > 0} />
    </div>
  );
}