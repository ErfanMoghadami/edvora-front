import type { StudentFinancials } from "@/types/student";

const WEEKS_PER_MONTH = 4.33;

interface FinancialInput {
  programType?: "weekly" | "monthly";
  sessionsCount?: number;
  sessionDuration?: number;
  rateType?: "hourly" | "per_session";
  rateAmount?: number;
}

export function calculateFinancials(input: FinancialInput): StudentFinancials {
  const sessionsCount = Number(input.sessionsCount) || 0;
  const sessionDuration = Number(input.sessionDuration) || 0;
  const rateAmount = Number(input.rateAmount) || 0;

  const monthlySessions =
    input.programType === "weekly"
      ? Math.round(sessionsCount * WEEKS_PER_MONTH)
      : sessionsCount;

  const perSessionAmount =
    input.rateType === "hourly"
      ? (sessionDuration / 60) * rateAmount
      : rateAmount;

  const monthlyAmount = perSessionAmount * monthlySessions;

  return {
    monthlySessions,
    monthlyAmount: Math.round(monthlyAmount),
    perSessionAmount: Math.round(perSessionAmount),
  };
}