import Link from "next/link";
import { Users } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import { StudentCard } from "./student-card";
import { StudentTable } from "./student-table";
import type { Student } from "@/types/student";

interface StudentListProps {
  students: Student[];
  hasAny: boolean;
}

export function StudentList({ students, hasAny }: StudentListProps) {
  if (!hasAny) {
    return (
      <EmptyState
        icon={<Users className="h-8 w-8" />}
        title="هنوز شاگردی ثبت نکردید"
        description="با افزودن اولین شاگرد، مدیریت جلسات و امور مالی را شروع کنید"
        action={
          <Link
            href={`${ROUTES.STUDENTS}/new`}
            className={buttonVariants()}
          >
            افزودن شاگرد
          </Link>
        }
      />
    );
  }

  if (students.length === 0) {
    return (
      <EmptyState
        icon={<Users className="h-8 w-8" />}
        title="شاگردی پیدا نشد"
        description="عبارت جستجو را تغییر دهید یا شاگرد جدیدی اضافه کنید"
      />
    );
  }

  return (
    <>
      <div className="hidden h-full lg:block">
        <StudentTable students={students} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
        {students.map((student) => (
          <StudentCard key={student.id} student={student} />
        ))}
      </div>
    </>
  );
}