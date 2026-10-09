import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { StudentBalance } from "@/types/student";

interface BalanceCardProps {
  balance: StudentBalance;
}

export function BalanceCard({ balance }: BalanceCardProps) {
  const items = [
    {
      label: "کل بدهی",
      value: formatCurrency(balance.totalDebt),
      color: "text-foreground",
    },
    {
      label: "پرداخت شده",
      value: formatCurrency(balance.totalPaid),
      color: "text-success",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">وضعیت مالی</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {items.map((item) => (
            <div key={item.label}>
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className={`mt-1 text-base font-semibold ${item.color}`}>
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <span className="text-sm font-medium text-foreground">
            مانده بدهی
          </span>
          <span
            className={
              balance.remaining > 0
                ? "text-xl font-bold text-destructive"
                : "text-xl font-bold text-success"
            }
          >
            {balance.remaining > 0
              ? formatCurrency(balance.remaining)
              : "تسویه شده"}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {balance.completedSessions} جلسه از {balance.totalSessions} برگزار
            شده
          </span>
        </div>
      </CardContent>
    </Card>
  );
}