import type { Metadata } from "next";
import { AdminUsersView } from "@/features/admin/components/admin-users-view";

export const metadata: Metadata = {
  title: "کاربران | پنل مدیریت",
};

export default function AdminUsersPage() {
  return <AdminUsersView />;
}