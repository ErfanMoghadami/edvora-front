import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { APP_NAME, ROUTES } from "@/lib/constants";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <div className="absolute left-4 top-4 z-10">
        <ThemeToggle />
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8 animate-slide-up">
          <div className="text-center">
            <Link
              href={ROUTES.HOME}
              className="inline-flex items-center gap-2 transition-opacity hover:opacity-80"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <GraduationCap className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold text-foreground">
                {APP_NAME}
              </span>
            </Link>
          </div>

          {children}
        </div>
      </div>

      <footer className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © ۱۴۰۴ {APP_NAME} — تمامی حقوق محفوظ است
      </footer>
    </div>
  );
}