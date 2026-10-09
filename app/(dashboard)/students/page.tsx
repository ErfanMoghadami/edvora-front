import type { Metadata } from "next";
import { StudentsView } from "@/features/students/components/students-view";

export const metadata: Metadata = {
  title: "شاگردها",
};

export default function StudentsPage() {
  return <StudentsView />;
}