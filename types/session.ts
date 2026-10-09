export type SessionStatus = "scheduled" | "completed" | "canceled";

export interface Session {
  id: string;
  studentId: string;
  date: string;
  duration: number;
  status: SessionStatus;
  note?: string;
  createdAt: string;
}

export interface SessionInput {
  studentId: string;
  date: string;
  duration: number;
  status: SessionStatus;
  note?: string;
}

export interface SessionWithStudent extends Session {
  studentName: string;
  studentPhone: string;
}

export interface SessionFilters {
  status: SessionStatus | "all";
  studentId: string | "all";
  fromDate: string;
  toDate: string;
}