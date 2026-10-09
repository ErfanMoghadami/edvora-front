"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSessionsApi } from "../api/sessions-api";
import { useStudents } from "@/features/students/hooks/use-students";
import type {
  SessionFilters,
  SessionWithStudent,
} from "@/types/session";

export function useAllSessions(filters: SessionFilters) {
  const sessionsQuery = useQuery({
    queryKey: ["sessions"],
    queryFn: () => getSessionsApi(),
  });

  const { students } = useStudents();

  const enriched = useMemo<SessionWithStudent[]>(() => {
    const sessions = sessionsQuery.data ?? [];
    const map = new Map(students.map((s) => [s.id, s]));
    return sessions
      .map((s) => {
        const student = map.get(s.studentId);
        return {
          ...s,
          studentName: student?.name ?? "نامشخص",
          studentPhone: student?.phone ?? "—",
        };
      })
      .sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
  }, [sessionsQuery.data, students]);

  const filtered = useMemo(() => {
    return enriched.filter((s) => {
      if (filters.status !== "all" && s.status !== filters.status) return false;
      if (filters.studentId !== "all" && s.studentId !== filters.studentId) {
        return false;
      }
      if (filters.fromDate && s.date < filters.fromDate) return false;
      if (filters.toDate && s.date > filters.toDate) return false;
      return true;
    });
  }, [enriched, filters]);

  const summary = useMemo(() => {
    return {
      total: filtered.length,
      completed: filtered.filter((s) => s.status === "completed").length,
      canceled: filtered.filter((s) => s.status === "canceled").length,
      scheduled: filtered.filter((s) => s.status === "scheduled").length,
    };
  }, [filtered]);

  return {
    sessions: filtered,
    totalCount: enriched.length,
    summary,
    isLoading: sessionsQuery.isLoading,
    isError: sessionsQuery.isError,
    refetch: sessionsQuery.refetch,
  };
}