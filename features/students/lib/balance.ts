import { calculateFinancials } from "./calculations";
import type { Student, StudentBalance } from "@/types/student";
import type { Session } from "@/types/session";
import type { Payment } from "@/types/payment";

export function calculateBalance(
  student: Student,
  sessions: Session[],
  payments: Payment[]
): StudentBalance {
  const fin = calculateFinancials(student);

  const studentSessions = sessions.filter((s) => s.studentId === student.id);
  const studentPayments = payments.filter((p) => p.studentId === student.id);

  const completedSessions = studentSessions.filter(
    (s) => s.status === "completed"
  ).length;

  let totalDebt = 0;

  if (student.paymentType === "per_session") {
    totalDebt = completedSessions * fin.perSessionAmount;
  } else {
    totalDebt = fin.monthlyAmount;
  }

  const totalPaid = studentPayments.reduce((sum, p) => sum + p.amount, 0);
  const remaining = Math.max(0, totalDebt - totalPaid);

  return {
    monthlyAmount: fin.monthlyAmount,
    totalSessions: studentSessions.length,
    completedSessions,
    totalDebt: Math.round(totalDebt),
    totalPaid: Math.round(totalPaid),
    remaining: Math.round(remaining),
  };
}