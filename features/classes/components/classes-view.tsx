"use client";

import Link from "next/link";
import { GraduationCap, Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { ClassesSkeleton } from "@/components/skeletons/classes-skeleton";
import { ROUTES } from "@/lib/constants";
import { toPersianDigits } from "@/lib/utils";
import { useClasses } from "../hooks/use-classes";
import { ClassCard } from "./class-card";

export function ClassesView() {
  const { classes, isLoading, isError, refetch } = useClasses();

  if (isLoading) return <ClassesSkeleton />;

  if (isError) {
    return (
      <div className="p-4 sm:p-6">
        <ErrorState onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader
        title="کلاس‌ها"
        description={
          classes.length > 0
            ? `${toPersianDigits(classes.length)} کلاس ثبت شده`
            : "کلاس‌های خود را مدیریت کنید"
        }
        action={
          <Link href={`${ROUTES.CLASSES}/new`} className={buttonVariants()}>
            <Plus className="h-4 w-4" />
            ساخت کلاس جدید
          </Link>
        }
      />

      {classes.length === 0 ? (
        <EmptyState
          icon={<GraduationCap className="h-8 w-8" />}
          title="هنوز کلاسی نساخته‌اید"
          description="کلاس بسازید، روزها و ساعت برگزاری را مشخص کنید و دانش‌آموزان را به آن اضافه کنید"
          action={
            <Link href={`${ROUTES.CLASSES}/new`} className={buttonVariants()}>
              ساخت کلاس جدید
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {classes.map((cls) => (
            <ClassCard key={cls.id} cls={cls} />
          ))}
        </div>
      )}
    </div>
  );
}
