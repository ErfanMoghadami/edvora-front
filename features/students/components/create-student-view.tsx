"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { PageHeader } from "@/components/shared/page-header";
import { useCreateStudent } from "../hooks/use-students";
import { StudentForm } from "./student-form";

export function CreateStudentView() {
  const createStudent = useCreateStudent();

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <Link
        href={ROUTES.STUDENTS}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowRight className="h-4 w-4" />
        بازگشت به شاگردها
      </Link>

      <PageHeader
        title="افزودن شاگرد جدید"
        description="اطلاعات شاگرد و الگوی کلاس را وارد کنید"
      />

      <StudentForm onSubmit={createStudent} submitLabel="افزودن شاگرد" />
    </div>
  );
}