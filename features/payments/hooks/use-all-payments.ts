"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPaymentsApi } from "../api/payments-api";
import { useStudents } from "@/features/students/hooks/use-students";
import type {
  PaymentFilters,
  PaymentWithStudent,
} from "@/types/payment";

export function useAllPayments(filters: PaymentFilters) {
  const paymentsQuery = useQuery({
    queryKey: ["payments"],
    queryFn: () => getPaymentsApi(),
  });

  const { students } = useStudents();

  const enriched = useMemo<PaymentWithStudent[]>(() => {
    const payments = paymentsQuery.data ?? [];
    const map = new Map(students.map((s) => [s.id, s]));
    return payments
      .map((p) => {
        const student = map.get(p.studentId);
        return {
          ...p,
          studentName: student?.name ?? "نامشخص",
          studentPhone: student?.phone ?? "—",
        };
      })
      .sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
  }, [paymentsQuery.data, students]);

  const filtered = useMemo(() => {
    return enriched.filter((p) => {
      if (filters.method !== "all" && p.method !== filters.method) return false;
      if (filters.studentId !== "all" && p.studentId !== filters.studentId) {
        return false;
      }
      if (filters.fromDate && p.date < filters.fromDate) return false;
      if (filters.toDate && p.date > filters.toDate) return false;
      return true;
    });
  }, [enriched, filters]);

  const totalAmount = useMemo(() => {
    return filtered.reduce((sum, p) => sum + p.amount, 0);
  }, [filtered]);

  return {
    payments: filtered,
    totalCount: enriched.length,
    totalAmount,
    isLoading: paymentsQuery.isLoading,
    isError: paymentsQuery.isError,
    refetch: paymentsQuery.refetch,
  };
}