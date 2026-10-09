import { Phone, FileText, CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientDate } from "@/components/shared/client-date";
import type { Student } from "@/types/student";

interface StudentInfoCardProps {
  student: Student;
}

export function StudentInfoCard({ student }: StudentInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">اطلاعات شاگرد</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
            <Phone className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground">شماره موبایل</p>
            <p className="mt-0.5 break-words text-sm font-medium text-foreground">
              {student.phone}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
            <CalendarDays className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground">تاریخ شروع</p>
            <p className="mt-0.5 break-words text-sm font-medium text-foreground">
              <ClientDate date={student.startDate} />
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
            <FileText className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground">یادداشت</p>
            <p className="mt-0.5 break-words text-sm font-medium text-foreground">
              {student.notes || "—"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}