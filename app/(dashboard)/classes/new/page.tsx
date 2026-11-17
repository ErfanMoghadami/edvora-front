import type { Metadata } from "next";
import { CreateClassView } from "@/features/classes/components/create-class-view";

export const metadata: Metadata = {
  title: "ساخت کلاس جدید",
};

export default function NewClassPage() {
  return <CreateClassView />;
}
