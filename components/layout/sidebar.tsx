import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { APP_NAME, ROUTES } from "@/lib/constants";
import { NavLinks } from "./nav-links";

export function Sidebar() {
  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-l lg:border-border lg:bg-card">
      <div className="flex h-16 items-center gap-3 border-b border-border px-6">
        <Link
          href={ROUTES.DASHBOARD}
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="text-base font-bold text-foreground">
            {APP_NAME}
          </span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <NavLinks />
      </div>

      <div className="border-t border-border p-4">
        <p className="text-xs text-muted-foreground text-center">
          نسخه ۱.۰.۰
        </p>
      </div>
    </aside>
  );
}