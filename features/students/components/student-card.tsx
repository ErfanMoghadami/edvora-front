import Link from "next/link";
import { Wallet, Clock, Repeat } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, getInitials } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import { calculateFinancials } from "../lib/calculations";
import type { Student } from "@/types/student";

interface StudentCardProps {
  student: Student;
}

export function StudentCard({ student }: StudentCardProps) {
  const fin = calculateFinancials(student);

  return (
    <Link href={`${ROUTES.STUDENTS}/${student.id}`} className="block group">
      <Card className="h-full transition-all duration-200 hover:border-primary/50 hover:shadow-md">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground">
              {getInitials(student.name)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="truncate font-semibold text-foreground transition-colors group-hover:text-primary">
                {student.name}
              </h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {student.phone}
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Repeat className="h-3.5 w-3.5 shrink-0" />
              <span>
                {student.programType === "weekly"
                  ? `${student.sessionsCount} جلسه در هفته`
                  : `${student.sessionsCount} جلسه در ماه`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 shrink-0" />
              <span>{student.sessionDuration} دقیقه</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
            <div className="flex items-center gap-1.5">
              <Wallet className="h-3.5 w-3.5 text-primary" />
              <span className="text-sm font-bold text-foreground">
                {formatCurrency(fin.monthlyAmount)}
              </span>
            </div>
            <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
              {student.paymentType === "per_session" ? "جلسه‌ای" : "کلی"}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}