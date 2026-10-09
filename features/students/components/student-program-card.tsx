import { Wallet, Clock, Repeat, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { Student } from "@/types/student";

interface StudentProgramCardProps {
  student: Student;
}

export function StudentProgramCard({ student }: StudentProgramCardProps) {
  const items = [
    {
      icon: Repeat,
      label: "برنامه",
      value:
        student.programType === "weekly"
          ? `${student.sessionsCount} جلسه در هفته`
          : `${student.sessionsCount} جلسه در ماه`,
    },
    {
      icon: Clock,
      label: "مدت هر جلسه",
      value: `${student.sessionDuration} دقیقه`,
    },
    {
      icon: Wallet,
      label: student.rateType === "hourly" ? "نرخ هر ساعت" : "نرخ هر جلسه",
      value: formatCurrency(student.rateAmount),
    },
    {
      icon: Calendar,
      label: "نوع تسویه",
      value: student.paymentType === "per_session" ? "جلسه‌ای" : "کلی",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">الگوی کلاس</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="flex items-center gap-3 rounded-lg border border-border p-3"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="mt-0.5 truncate text-sm font-medium text-foreground">
                  {item.value}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}