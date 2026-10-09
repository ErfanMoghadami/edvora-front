import type { Metadata } from "next";
import { EditStudentView } from "@/features/students/components/edit-student-view";

export const metadata: Metadata = {
  title: "ویرایش شاگرد",
};

export default function EditStudentPage() {
  return <EditStudentView />;
}