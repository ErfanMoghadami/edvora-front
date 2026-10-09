import {
  LayoutDashboard,
  Users,
  Calendar,
  Wallet,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { ROUTES } from "@/lib/constants";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { title: "داشبورد", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { title: "شاگردها", href: ROUTES.STUDENTS, icon: Users },
  { title: "جلسات", href: ROUTES.SESSIONS, icon: Calendar },
  { title: "پرداخت‌ها", href: ROUTES.PAYMENTS, icon: Wallet },
  { title: "تنظیمات", href: ROUTES.SETTINGS, icon: Settings },
];