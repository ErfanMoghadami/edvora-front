import type { Metadata } from "next";
import { CreateStudentView } from "@/features/students/components/create-student-view";

export const metadata: Metadata = {
  title: "افزودن شاگرد",
};

export default function NewStudentPage() {
  return <CreateStudentView />;
}