"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { SessionsSkeleton } from "@/components/skeletons/sessions-skeleton";
import { useStudents } from "@/features/students/hooks/use-students";
import { useAllSessions } from "../hooks/use-all-sessions";
import { SessionsFilters } from "./sessions-filters";
import { SessionsList } from "./sessions-list";
import { SessionsSummary } from "./sessions-summary";
import type { SessionFilters } from "@/types/session";

const INITIAL_FILTERS: SessionFilters = {
  status: "all",
  studentId: "all",
  fromDate: "",
  toDate: "",
};

export function SessionsView() {
  const [filters, setFilters] = useState<SessionFilters>(INITIAL_FILTERS);
  const { students } = useStudents();
  const { sessions, totalCount, summary, isLoading, isError, refetch } =
    useAllSessions(filters);

  function resetFilters() {
    setFilters(INITIAL_FILTERS);
  }

  if (isLoading) return <SessionsSkeleton />;

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
        title="جلسات"
        description="همه جلسات ثبت‌شده در یک نگاه"
      />

      {totalCount > 0 && (
        <SessionsSummary
          total={summary.total}
          completed={summary.completed}
          canceled={summary.canceled}
          scheduled={summary.scheduled}
        />
      )}

      {totalCount > 0 && (
        <SessionsFilters
          filters={filters}
          onChange={setFilters}
          students={students}
          onReset={resetFilters}
        />
      )}

      <SessionsList sessions={sessions} hasAny={totalCount > 0} />
    </div>
  );
}