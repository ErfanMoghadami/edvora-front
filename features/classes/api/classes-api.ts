import { api } from "@/lib/api-client";
import type {
  ClassInput,
  ClassItem,
  QuickStudentInput,
  Term,
  TermInput,
} from "@/types/class";
import type { Student } from "@/types/student";

interface ApiTerm {
  id: string;
  name: string;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
}

interface ApiClass {
  id: string;
  name: string;
  term: ApiTerm;
  weekdays: number[];
  startTime: string;
  endTime: string;
  sessionDuration: number;
  students?: { id: string; name: string; phone: string }[];
  createdAt: string;
}

function normalizeTerm(raw: ApiTerm): Term {
  return {
    id: raw.id,
    name: raw.name,
    startDate: raw.startDate ?? undefined,
    endDate: raw.endDate ?? undefined,
    createdAt: raw.createdAt,
  };
}

function normalizeClass(raw: ApiClass): ClassItem {
  return {
    id: raw.id,
    name: raw.name,
    term: normalizeTerm(raw.term),
    weekdays: raw.weekdays,
    startTime: raw.startTime,
    endTime: raw.endTime,
    sessionDuration: Number(raw.sessionDuration),
    students: (raw.students ?? []).map((s) => ({
      id: s.id,
      name: s.name,
      phone: s.phone,
    })),
    createdAt: raw.createdAt,
  };
}

export async function getTermsApi(): Promise<Term[]> {
  const { data } = await api.get<ApiTerm[]>("/terms");
  return data.map(normalizeTerm);
}

export async function createTermApi(input: TermInput): Promise<Term> {
  const { data } = await api.post<ApiTerm>("/terms", input);
  return normalizeTerm(data);
}

export async function getClassesApi(): Promise<ClassItem[]> {
  const { data } = await api.get<ApiClass[]>("/classes");
  return data.map(normalizeClass);
}

export async function createClassApi(input: ClassInput): Promise<ClassItem> {
  const { data } = await api.post<ApiClass>("/classes", input);
  return normalizeClass(data);
}

export async function createQuickStudentApi(
  input: QuickStudentInput
): Promise<Pick<Student, "id" | "name" | "phone">> {
  const { data } = await api.post<{ id: string; name: string; phone: string }>(
    "/students/quick",
    input
  );
  return { id: data.id, name: data.name, phone: data.phone };
}