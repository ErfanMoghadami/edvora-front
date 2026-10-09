import { api } from "@/lib/api-client";
import type { Payment, PaymentInput } from "@/types/payment";

interface ApiPayment {
  id: string;
  userId: string;
  studentId: string;
  amount: string | number;
  date: string;
  method: Payment["method"];
  note: string | null;
  createdAt: string;
}

function normalize(raw: ApiPayment): Payment {
  return {
    id: raw.id,
    studentId: raw.studentId,
    amount: Number(raw.amount),
    date: raw.date,
    method: raw.method,
    note: raw.note ?? undefined,
    createdAt: raw.createdAt,
  };
}

export async function getPaymentsApi(
  studentId?: string
): Promise<Payment[]> {
  const url = studentId
    ? `/payments?studentId=${studentId}`
    : "/payments";
  const { data } = await api.get<ApiPayment[]>(url);
  return data.map(normalize);
}

export async function createPaymentApi(
  input: PaymentInput
): Promise<Payment> {
  const { data } = await api.post<ApiPayment>("/payments", input);
  return normalize(data);
}

export async function updatePaymentApi(
  id: string,
  input: Partial<PaymentInput>
): Promise<Payment> {
  const { data } = await api.patch<ApiPayment>(`/payments/${id}`, input);
  return normalize(data);
}

export async function deletePaymentApi(id: string): Promise<void> {
  await api.delete(`/payments/${id}`);
}