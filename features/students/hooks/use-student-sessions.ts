"use client";

import { useCallback, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  getSessionsApi,
  createSessionApi,
  updateSessionApi,
  deleteSessionApi,
} from "@/features/sessions/api/sessions-api";
import {
  getPaymentsApi,
  createPaymentApi,
  deletePaymentApi,
} from "@/features/payments/api/payments-api";
import { getStudentApi } from "../api/students-api";
import { calculateBalance } from "../lib/balance";
import { getErrorMessage } from "@/lib/api-client";
import type { SessionInput } from "@/types/session";
import type { PaymentInput } from "@/types/payment";

export function useStudentSessions(studentId: string) {
  const sessionsQuery = useQuery({
    queryKey: ["sessions", studentId],
    queryFn: () => getSessionsApi(studentId),
    enabled: !!studentId,
  });

  const paymentsQuery = useQuery({
    queryKey: ["payments", studentId],
    queryFn: () => getPaymentsApi(studentId),
    enabled: !!studentId,
  });

  const studentQuery = useQuery({
    queryKey: ["students", studentId],
    queryFn: () => getStudentApi(studentId),
    enabled: !!studentId,
  });

  const balance = useMemo(() => {
    if (!studentQuery.data) return null;
    return calculateBalance(
      studentQuery.data,
      sessionsQuery.data ?? [],
      paymentsQuery.data ?? []
    );
  }, [studentQuery.data, sessionsQuery.data, paymentsQuery.data]);

  return {
    studentSessions: sessionsQuery.data ?? [],
    studentPayments: paymentsQuery.data ?? [],
    balance,
    isLoading:
      sessionsQuery.isLoading ||
      paymentsQuery.isLoading ||
      studentQuery.isLoading,
  };
}

export function useAddSession() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (input: SessionInput) => createSessionApi(input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      queryClient.invalidateQueries({
        queryKey: ["sessions", variables.studentId],
      });
      toast.success("جلسه ثبت شد");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  return useCallback(
    (input: SessionInput) => mutation.mutateAsync(input),
    [mutation]
  );
}

export function useUpdateSession() {
  const queryClient = useQueryClient();

  return useCallback(
    async (id: string, input: Partial<SessionInput>) => {
      const updated = await updateSessionApi(id, input);
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      queryClient.invalidateQueries({
        queryKey: ["sessions", updated.studentId],
      });
      return updated;
    },
    [queryClient]
  );
}

export function useDeleteSession() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => deleteSessionApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      toast.success("جلسه حذف شد");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  return useCallback(
    (id: string) => mutation.mutateAsync(id),
    [mutation]
  );
}

export function useAddPayment() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (input: PaymentInput) => createPaymentApi(input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({
        queryKey: ["payments", variables.studentId],
      });
      toast.success("پرداخت ثبت شد");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  return useCallback(
    (input: PaymentInput) => mutation.mutateAsync(input),
    [mutation]
  );
}

export function useDeletePayment() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => deletePaymentApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      toast.success("پرداخت حذف شد");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  return useCallback(
    (id: string) => mutation.mutateAsync(id),
    [mutation]
  );
}