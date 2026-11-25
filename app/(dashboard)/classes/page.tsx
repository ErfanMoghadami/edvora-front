import type { Metadata } from "next";
import { ClassesView } from "@/features/classes/components/classes-view";

export const metadata: Metadata = {
  title: "کلاس‌ها",
};

export default function ClassesPage() {
  return <ClassesView />;
}
