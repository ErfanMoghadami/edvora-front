import { api } from "@/lib/api-client";
import type { Session, SessionInput, SessionStatus } from "@/types/session";

interface ApiSession {
  id: string;
  userId: string;
  studentId: string;
  date: string;
  duration: number;
  status: SessionStatus;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

function normalize(raw: ApiSession): Session {
  return {
    id: raw.id,
    studentId: raw.studentId,
    date: raw.date,
    duration: Number(raw.duration),
    status: raw.status,
    note: raw.note ?? undefined,
    createdAt: raw.createdAt,
  };
}

export async function getSessionsApi(studentId?: string): Promise<Session[]> {
  const url = studentId
    ? `/sessions?studentId=${studentId}`
    : "/sessions";
  const { data } = await api.get<ApiSession[]>(url);
  return data.map(normalize);
}

export async function createSessionApi(
  input: SessionInput
): Promise<Session> {
  const { data } = await api.post<ApiSession>("/sessions", input);
  return normalize(data);
}

export async function updateSessionApi(
  id: string,
  input: Partial<SessionInput>
): Promise<Session> {
  const { data } = await api.patch<ApiSession>(`/sessions/${id}`, input);
  return normalize(data);
}

export async function deleteSessionApi(id: string): Promise<void> {
  await api.delete(`/sessions/${id}`);
}