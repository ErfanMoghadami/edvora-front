import type { Metadata } from "next";
import { AdminUserDetails } from "@/features/admin/components/admin-user-details";

export const metadata: Metadata = {
  title: "جزئیات کاربر | پنل مدیریت",
};

export default function AdminUserDetailsPage() {
  return <AdminUserDetails />;
}