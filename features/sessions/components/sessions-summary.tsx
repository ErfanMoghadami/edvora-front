import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SessionsSummaryProps {
  total: number;
  completed: number;
  canceled: number;
  scheduled: number;
}

export function SessionsSummary({
  total,
  completed,
  canceled,
  scheduled,
}: SessionsSummaryProps) {
  const stats = [
    { label: "کل جلسات", value: total, color: "text-foreground" },
    { label: "برگزار شده", value: completed, color: "text-success" },
    { label: "کنسل شده", value: canceled, color: "text-destructive" },
    { label: "برنامه‌ریزی شده", value: scheduled, color: "text-primary" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s) => (
        <Card key={s.label}>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              {s.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}