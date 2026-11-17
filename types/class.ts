import type { Student } from "./student";

export interface Term {
  id: string;
  name: string;
  startDate?: string;
  endDate?: string;
  createdAt: string;
}

export interface TermInput {
  name: string;
}

export interface ClassItem {
  id: string;
  name: string;
  term: Term;
  /** 0 = شنبه ... 6 = جمعه */
  weekdays: number[];
  startTime: string;
  endTime: string;
  sessionDuration: number;
  students: Pick<Student, "id" | "name" | "phone">[];
  createdAt: string;
}

export interface ClassInput {
  name: string;
  termId: string;
  weekdays: number[];
  startTime: string;
  endTime: string;
  studentIds: string[];
}

export interface QuickStudentInput {
  name: string;
  phone: string;
}