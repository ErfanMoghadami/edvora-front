import type { Metadata } from "next";
import { StudentDetailView } from "@/features/students/components/student-detail-view";

export const metadata: Metadata = {
  title: "جزئیات شاگرد",
};

export default function StudentDetailPage() {
  return <StudentDetailView />;
}