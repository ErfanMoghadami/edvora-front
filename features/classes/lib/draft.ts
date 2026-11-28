import type { Student } from "@/types/student";
import type { ClassFormValues } from "./validation";

export type DraftStudent = Pick<Student, "id" | "name" | "phone">;

export interface ClassDraft {
  values?: Partial<ClassFormValues>;
  students: DraftStudent[];
  savedAt: number;
}

const KEY = "edvora:class-draft";
const MAX_AGE_MS = 30 * 60 * 1000;

/** ?from=class روی صفحه‌ی ساخت شاگرد یعنی از فرم ساخت کلاس آمده‌ایم */
export function isFromClass(): boolean {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("from") === "class";
}

export function readClassDraft(): ClassDraft | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const draft = JSON.parse(raw) as ClassDraft;
    if (Date.now() - draft.savedAt > MAX_AGE_MS) {
      sessionStorage.removeItem(KEY);
      return null;
    }
    return draft;
  } catch {
    return null;
  }
}

export function saveClassDraft(
  draft: Omit<ClassDraft, "savedAt">
): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ ...draft, savedAt: Date.now() }));
  } catch {
    // sessionStorage در دسترس نیست؛ فرم بدون بازیابی می‌ماند
  }
}

export function clearClassDraft(): void {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}

/** شاگرد تازه‌ساخته‌شده را به پیش‌نویس کلاس اضافه می‌کند */
export function addStudentToClassDraft(student: DraftStudent): void {
  const draft: Pick<ClassDraft, "values" | "students"> = readClassDraft() ?? {
    students: [],
  };
  if (draft.students.some((s) => s.id === student.id)) return;
  saveClassDraft({
    values: draft.values,
    students: [...draft.students, student],
  });
}
