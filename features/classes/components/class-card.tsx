import { Clock, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { toPersianDigits } from "@/lib/utils";
import { weekdayLabel } from "../lib/weekdays";
import type { ClassItem } from "@/types/class";

interface ClassCardProps {
  cls: ClassItem;
}

export function ClassCard({ cls }: ClassCardProps) {
  const preview = cls.students.slice(0, 3).map((s) => s.name);
  const rest = cls.students.length - preview.length;

  return (
    <Card className="h-full transition-all duration-200 hover:border-primary/50 hover:shadow-md">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 truncate font-semibold text-foreground">
            {cls.name}
          </h3>
          <span className="shrink-0 rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-secondary-foreground">
            {cls.term.name}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {cls.weekdays.map((d) => (
            <span
              key={d}
              className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
            >
              {weekdayLabel(d)}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5 shrink-0" />
          <span dir="ltr">
            {toPersianDigits(cls.startTime)} - {toPersianDigits(cls.endTime)}
          </span>
          <span>({toPersianDigits(cls.sessionDuration)} دقیقه)</span>
        </div>

        <div className="space-y-1.5 border-t border-border pt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5 shrink-0" />
            <span>
              {cls.students.length > 0
                ? `${toPersianDigits(cls.students.length)} دانش‌آموز`
                : "بدون دانش‌آموز"}
            </span>
          </div>
          {preview.length > 0 && (
            <p className="truncate">
              {preview.join("، ")}
              {rest > 0 && ` و ${toPersianDigits(rest)} نفر دیگر`}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
