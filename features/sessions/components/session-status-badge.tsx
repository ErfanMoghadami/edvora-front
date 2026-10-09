import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SessionStatus } from "@/types/session";

interface SessionStatusBadgeProps {
  status: SessionStatus;
}

const STYLES: Record<
  SessionStatus,
  { label: string; className: string; icon: typeof CheckCircle2 }
> = {
  completed: {
    label: "برگزار شد",
    className: "bg-success/10 text-success border-success/20",
    icon: CheckCircle2,
  },
  canceled: {
    label: "کنسل شد",
    className: "bg-destructive/10 text-destructive border-destructive/20",
    icon: XCircle,
  },
  scheduled: {
    label: "برنامه‌ریزی شده",
    className: "bg-secondary text-secondary-foreground border-border",
    icon: Clock,
  },
};

export function SessionStatusBadge({ status }: SessionStatusBadgeProps) {
  const style = STYLES[status];
  const Icon = style.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
        style.className
      )}
    >
      <Icon className="h-3 w-3" />
      {style.label}
    </span>
  );
}