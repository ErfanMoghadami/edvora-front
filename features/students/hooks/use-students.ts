"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  getStudentsApi,
  getStudentApi,
  createStudentApi,
  updateStudentApi,
  deleteStudentApi,
} from "../api/students-api";
import { getErrorMessage } from "@/lib/api-client";
import { calculateFinancials } from "../lib/calculations";
import { ROUTES } from "@/lib/constants";
import type { Student, StudentInput } from "@/types/student";

export function useStudents(searchQuery = "") {
  const query = useQuery({
    queryKey: ["students"],
    queryFn: getStudentsApi,
  });

  const filtered = useMemo(() => {
    const students = query.data ?? [];
    if (!searchQuery.trim()) return students;
    const q = searchQuery.trim().toLowerCase();
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) || s.phone.includes(q)
    );
  }, [query.data, searchQuery]);

  return {
    students: filtered,
    totalCount: query.data?.length ?? 0,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}

export function useStudent(id: string) {
  const query = useQuery({
    queryKey: ["students", id],
    queryFn: () => getStudentApi(id),
    enabled: !!id,
  });

  const financials = useMemo(() => {
    if (!query.data) return null;
    return calculateFinancials(query.data);
  }, [query.data]);

  return {
    student: query.data,
    financials,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}

export function useCreateStudent() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (input: StudentInput) => createStudentApi(input),
    onSuccess: (student) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success(`${student.name} با موفقیت اضافه شد`);
      router.push(ROUTES.STUDENTS);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  return useCallback(
    (input: StudentInput) => mutation.mutateAsync(input),
    [mutation]
  );
}

export function useUpdateStudent(id: string) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (input: Partial<StudentInput>) =>
      updateStudentApi(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["students", id] });
      toast.success("تغییرات ذخیره شد");
      router.push(`${ROUTES.STUDENTS}/${id}`);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  return useCallback(
    (input: Partial<StudentInput>) => mutation.mutateAsync(input),
    [mutation]
  );
}

export function useDeleteStudent() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => deleteStudentApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("شاگرد حذف شد");
      router.push(ROUTES.STUDENTS);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  return useCallback(
    (id: string, _name: string) => mutation.mutateAsync(id),
    [mutation]
  );
}

export function getStudentFinancials(student: Student) {
  return calculateFinancials(student);
}

export function useUpdateStudentProfile(id: string) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  return {
    loading,
    update: async (input: Partial<StudentInput>) => {
      setLoading(true);
      try {
        await updateStudentApi(id, input);
        queryClient.invalidateQueries({ queryKey: ["students", id] });
      } finally {
        setLoading(false);
      }
    },
  };
}