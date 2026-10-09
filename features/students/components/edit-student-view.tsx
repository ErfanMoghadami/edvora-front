"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, UserX } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { ROUTES } from "@/lib/constants";
import { useStudent, useUpdateStudent } from "../hooks/use-students";
import { StudentForm } from "./student-form";

export function EditStudentView() {
  const params = useParams();
  const id = params.id as string;
  const { student } = useStudent(id);
  const update = useUpdateStudent(id);

  if (!student) {
    return (
      <div className="p-4 sm:p-6">
        <EmptyState
          icon={<UserX className="h-8 w-8" />}
          title="شاگرد پیدا نشد"
          description="این شاگرد حذف شده یا آدرس اشتباه است"
          action={
            <Link href={ROUTES.STUDENTS} className={buttonVariants()}>
              بازگشت به لیست
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <Link
        href={`${ROUTES.STUDENTS}/${student.id}`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowRight className="h-4 w-4" />
        بازگشت به جزئیات
      </Link>

      <PageHeader
        title="ویرایش شاگرد"
        description={`اطلاعات ${student.name} را ویرایش کنید`}
      />

      <StudentForm
        initial={student}
        onSubmit={update}
        submitLabel="ذخیره تغییرات"
      />
    </div>
  );
}