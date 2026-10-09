import axios from "axios";
import type { Student } from "@/types/student";
import type { Session } from "@/types/session";
import type { Payment } from "@/types/payment";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

interface ShareResponse {
  student: {
    id: string;
    name: string;
    phone: string;
    programType: "weekly" | "monthly";
    sessionsCount: number;
    sessionDuration: number;
    rateType: "hourly" | "per_session";
    rateAmount: string | number;
    paymentType: "per_session" | "lump_sum";
    startDate: string;
    shareToken: string;
    createdAt: string;
  };
  sessions: Array<{
    id: string;
    studentId: string;
    date: string;
    duration: number;
    status: "scheduled" | "completed" | "canceled";
    note: string | null;
    createdAt: string;
  }>;
  payments: Array<{
    id: string;
    studentId: string;
    amount: string | number;
    date: string;
    method: "cash" | "card" | "transfer" | "other";
    note: string | null;
    createdAt: string;
  }>;
}

export interface SharedData {
  student: Student;
  sessions: Session[];
  payments: Payment[];
}

export async function getSharedDataApi(token: string): Promise<SharedData> {
  const { data } = await axios.get<ShareResponse>(
    `${API_URL}/share/${token}`
  );

  const student: Student = {
    id: data.student.id,
    name: data.student.name,
    phone: data.student.phone,
    programType: data.student.programType,
    sessionsCount: Number(data.student.sessionsCount),
    sessionDuration: Number(data.student.sessionDuration),
    rateType: data.student.rateType,
    rateAmount: Number(data.student.rateAmount),
    paymentType: data.student.paymentType,
    startDate: data.student.startDate,
    shareToken: data.student.shareToken,
    createdAt: data.student.createdAt,
  };

  const sessions: Session[] = data.sessions.map((s) => ({
    id: s.id,
    studentId: s.studentId,
    date: s.date,
    duration: Number(s.duration),
    status: s.status,
    note: s.note ?? undefined,
    createdAt: s.createdAt,
  }));

  const payments: Payment[] = data.payments.map((p) => ({
    id: p.id,
    studentId: p.studentId,
    amount: Number(p.amount),
    date: p.date,
    method: p.method,
    note: p.note ?? undefined,
    createdAt: p.createdAt,
  }));

  return { student, sessions, payments };
}