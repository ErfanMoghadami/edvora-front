"use client";

import { Users, Calendar, Wallet, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { useStudents } from "@/features/students/hooks/use-students";
import { calculateFinancials } from "@/features/students/lib/calculations";
import { getSessionsApi } from "@/features/sessions/api/sessions-api";
import { getPaymentsApi } from "@/features/payments/api/payments-api";

export function StatsCards() {
  const { students } = useStudents();

  const sessionsQuery = useQuery({
    queryKey: ["sessions"],
    queryFn: () => getSessionsApi(),
  });

  const paymentsQuery = useQuery({
    queryKey: ["payments"],
    queryFn: () => getPaymentsApi(),
  });

  const totalMonthly = students.reduce((sum, s) => {
    return sum + calculateFinancials(s).monthlyAmount;
  }, 0);

  const completedSessionsThisMonth = (sessionsQuery.data ?? []).filter(
    (s) => s.status === "completed"
  ).length;

  const totalDebt = students.reduce((sum, s) => {
    const studentSessions = (sessionsQuery.data ?? []).filter(
      (sn) => sn.studentId === s.id && sn.status === "completed"
    );
    const studentPayments = (paymentsQuery.data ?? []).filter(
      (p) => p.studentId === s.id
    );
    const fin = calculateFinancials(s);

    const debt =
      s.paymentType === "per_session"
        ? studentSessions.length * fin.perSessionAmount
        : fin.monthlyAmount;

    const paid = studentPayments.reduce((acc, p) => acc + p.amount, 0);
    return sum + Math.max(0, debt - paid);
  }, 0);

  const stats = [
    {
      title: "کل شاگردها",
      value: `${students.length} نفر`,
      icon: Users,
    },
    {
      title: "جلسات برگزارشده",
      value: `${completedSessionsThisMonth} جلسه`,
      icon: Calendar,
    },
    {
      title: "درآمد ماه",
      value: formatCurrency(totalMonthly),
      icon: Wallet,
    },
    {
      title: "طلب معوق",
      value: formatCurrency(totalDebt),
      icon: AlertCircle,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">
                {stat.value}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}