"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/shared/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { StudentsSkeleton } from "@/components/skeletons/students-skeleton";
import { ROUTES } from "@/lib/constants";
import { useStudents } from "../hooks/use-students";
import { StudentList } from "./student-list";

export function StudentsView() {
  const [query, setQuery] = useState("");
  const { students, totalCount, isLoading, isError, refetch } = useStudents(query);

  if (isLoading) return <StudentsSkeleton />;

  if (isError) {
    return (
      <div className="p-4 sm:p-6">
        <ErrorState onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col gap-6 p-4 sm:p-6">
      <div className="shrink-0 space-y-4">
        <PageHeader
          title="شاگردها"
          description={
            totalCount > 0
              ? `${totalCount} شاگرد ثبت شده`
              : "شاگردهای خود را مدیریت کنید"
          }
          action={
            <Link
              href={`${ROUTES.STUDENTS}/new`}
              className={buttonVariants()}
            >
              <Plus className="h-4 w-4" />
              افزودن شاگرد
            </Link>
          }
        />

        {totalCount > 0 && (
          <div className="relative max-w-md">
            <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="جستجو بر اساس نام یا شماره..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pr-9"
            />
          </div>
        )}
      </div>

      <div className="min-h-0 flex-1 lg:overflow-hidden">
        <StudentList students={students} hasAny={totalCount > 0} />
      </div>
    </div>
  );
}