"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  createClassApi,
  createQuickStudentApi,
  createTermApi,
  getClassesApi,
  getTermsApi,
} from "../api/classes-api";
import { getErrorMessage } from "@/lib/api-client";
import { ROUTES } from "@/lib/constants";
import type { ClassInput, QuickStudentInput, TermInput } from "@/types/class";

export function useClasses() {
  const query = useQuery({
    queryKey: ["classes"],
    queryFn: getClassesApi,
  });

  return {
    classes: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}

export function useTerms() {
  const query = useQuery({
    queryKey: ["terms"],
    queryFn: getTermsApi,
  });

  return {
    terms: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

export function useCreateTerm() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (input: TermInput) => createTermApi(input),
    onSuccess: (term) => {
      queryClient.invalidateQueries({ queryKey: ["terms"] });
      toast.success(`ترم «${term.name}» اضافه شد`);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  return useCallback(
    (input: TermInput) => mutation.mutateAsync(input),
    [mutation]
  );
}

export function useCreateQuickStudent() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (input: QuickStudentInput) => createQuickStudentApi(input),
    onSuccess: (student) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success(`${student.name} اضافه شد`);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  return useCallback(
    (input: QuickStudentInput) => mutation.mutateAsync(input),
    [mutation]
  );
}

export function useCreateClass() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (input: ClassInput) => createClassApi(input),
    onSuccess: (cls) => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      toast.success(`کلاس «${cls.name}» ساخته شد`);
      router.push(ROUTES.CLASSES);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  return useCallback(
    (input: ClassInput) => mutation.mutateAsync(input),
    [mutation]
  );
}