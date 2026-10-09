export type ProgramType = "weekly" | "monthly";
export type RateType = "hourly" | "per_session";
export type PaymentType = "per_session" | "lump_sum";

export interface Student {
  id: string;
  name: string;
  phone: string;
  notes?: string;
  programType: ProgramType;
  sessionsCount: number;
  sessionDuration: number;
  rateType: RateType;
  rateAmount: number;
  paymentType: PaymentType;
  startDate: string;
  createdAt: string;
  shareToken: string;
}

export interface StudentInput {
  name: string;
  phone: string;
  notes?: string;
  programType: ProgramType;
  sessionsCount: number;
  sessionDuration: number;
  rateType: RateType;
  rateAmount: number;
  paymentType: PaymentType;
  startDate: string;
}

export interface StudentFinancials {
  monthlySessions: number;
  monthlyAmount: number;
  perSessionAmount: number;
}

export interface StudentBalance {
  monthlyAmount: number;
  totalSessions: number;
  completedSessions: number;
  totalDebt: number;
  totalPaid: number;
  remaining: number;
}