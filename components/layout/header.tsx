import { ThemeToggle } from "./theme-toggle";
import { MobileNav } from "./mobile-nav";
import { UserMenu } from "./user-menu";

interface HeaderProps {
  title?: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-3">
        <MobileNav />
        {title && (
          <h1 className="text-base font-semibold text-foreground sm:text-lg">
            {title}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}