import type { Metadata } from "next";
import { AdminDashboard } from "@/features/admin/components/admin-dashboard";

export const metadata: Metadata = {
  title: "پنل مدیریت",
};

export default function AdminPage() {
  return <AdminDashboard />;
}