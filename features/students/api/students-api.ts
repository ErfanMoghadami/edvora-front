import { api } from "@/lib/api-client";
import type { Student, StudentInput } from "@/types/student";

interface ApiStudent {
  id: string;
  userId: string;
  name: string;
  phone: string;
  notes: string | null;
  programType: "weekly" | "monthly";
  sessionsCount: number;
  sessionDuration: number;
  rateType: "hourly" | "per_session";
  rateAmount: string | number;
  paymentType: "per_session" | "lump_sum";
  startDate: string;
  shareToken: string;
  createdAt: string;
  updatedAt: string;
}

function normalizeStudent(raw: ApiStudent): Student {
  return {
    id: raw.id,
    name: raw.name,
    phone: raw.phone,
    notes: raw.notes ?? undefined,
    programType: raw.programType,
    sessionsCount: Number(raw.sessionsCount),
    sessionDuration: Number(raw.sessionDuration),
    rateType: raw.rateType,
    rateAmount: Number(raw.rateAmount),
    paymentType: raw.paymentType,
    startDate: raw.startDate,
    shareToken: raw.shareToken,
    createdAt: raw.createdAt,
  };
}

export async function getStudentsApi(): Promise<Student[]> {
  const { data } = await api.get<ApiStudent[]>("/students");
  return data.map(normalizeStudent);
}

export async function getStudentApi(id: string): Promise<Student> {
  const { data } = await api.get<ApiStudent>(`/students/${id}`);
  return normalizeStudent(data);
}

export async function createStudentApi(
  input: StudentInput
): Promise<Student> {
  const { data } = await api.post<ApiStudent>("/students", input);
  return normalizeStudent(data);
}

export async function updateStudentApi(
  id: string,
  input: Partial<StudentInput>
): Promise<Student> {
  const { data } = await api.patch<ApiStudent>(`/students/${id}`, input);
  return normalizeStudent(data);
}

export async function deleteStudentApi(id: string): Promise<void> {
  await api.delete(`/students/${id}`);
}