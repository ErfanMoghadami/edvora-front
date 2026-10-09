import type { Metadata } from "next";
import { SessionsView } from "@/features/sessions/components/sessions-view";

export const metadata: Metadata = {
  title: "جلسات",
};

export default function SessionsPage() {
  return <SessionsView />;
}