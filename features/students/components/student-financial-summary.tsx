import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { calculateFinancials } from "../lib/calculations";
import type { Student } from "@/types/student";

interface StudentFinancialSummaryProps {
  student: Student;
}

export function StudentFinancialSummary({
  student,
}: StudentFinancialSummaryProps) {
  const fin = calculateFinancials(student);

  const stats = [
    {
      label: "تعداد جلسات در ماه",
      value: `${fin.monthlySessions} جلسه`,
    },
    {
      label: "مبلغ هر جلسه",
      value: formatCurrency(fin.perSessionAmount),
    },
  ];

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardContent className="p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="mt-1 text-lg font-semibold text-foreground">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-border/60 pt-4 sm:border-r sm:border-t-0 sm:pr-6 sm:pt-0">
            <p className="text-xs text-muted-foreground">مبلغ ماهانه</p>
            <p className="mt-1 text-2xl font-bold text-primary">
              {formatCurrency(fin.monthlyAmount)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}