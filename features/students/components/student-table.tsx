import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { formatCurrency, getInitials } from "@/lib/utils";
import { calculateFinancials } from "../lib/calculations";
import type { Student } from "@/types/student";

interface StudentTableProps {
  students: Student[];
}

export function StudentTable({ students }: StudentTableProps) {
  return (
    <div className="h-full overflow-hidden rounded-xl border border-border bg-card">
      <div className="h-full overflow-y-auto">
        <table className="w-full">
          <thead className="sticky top-0 z-10 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
            <tr className="border-b border-border text-xs font-medium text-muted-foreground">
              <th className="px-4 py-3 text-right font-medium">شاگرد</th>
              <th className="px-4 py-3 text-right font-medium">برنامه</th>
              <th className="px-4 py-3 text-right font-medium">مدت</th>
              <th className="px-4 py-3 text-right font-medium">نرخ هر جلسه</th>
              <th className="px-4 py-3 text-right font-medium">مبلغ ماهانه</th>
              <th className="px-4 py-3 text-right font-medium">تسویه</th>
              <th className="px-4 py-3 text-left font-medium w-24"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {students.map((student) => {
              const fin = calculateFinancials(student);
              return (
                <tr
                  key={student.id}
                  className="group transition-colors hover:bg-muted/50"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`${ROUTES.STUDENTS}/${student.id}`}
                      className="flex items-center gap-3"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                        {getInitials(student.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                          {student.name}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {student.phone}
                        </p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-foreground">
                      {student.programType === "weekly"
                        ? `${student.sessionsCount} جلسه / هفته`
                        : `${student.sessionsCount} جلسه / ماه`}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-muted-foreground">
                      {student.sessionDuration} دقیقه
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-foreground">
                      {formatCurrency(fin.perSessionAmount)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-bold text-primary">
                      {formatCurrency(fin.monthlyAmount)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-secondary-foreground">
                      {student.paymentType === "per_session" ? "جلسه‌ای" : "کلی"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-left">
                    <Link
                      href={`${ROUTES.STUDENTS}/${student.id}`}
                      className="inline-flex h-8 items-center rounded-md px-3 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                    >
                      مشاهده
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}