export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  date: string;
  method: "cash" | "card" | "transfer" | "other";
  note?: string;
  createdAt: string;
}

export interface PaymentInput {
  studentId: string;
  amount: number;
  date: string;
  method: Payment["method"];
  note?: string;
}

export interface PaymentWithStudent extends Payment {
  studentName: string;
  studentPhone: string;
}

export interface PaymentFilters {
  method: Payment["method"] | "all";
  studentId: string | "all";
  fromDate: string;
  toDate: string;
}