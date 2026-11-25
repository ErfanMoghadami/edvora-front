import { cn, toPersianDigits } from "@/lib/utils";
import { formatClassTime, type ClassColor } from "../lib/schedule";

interface ClassEventCardProps {
  name: string;
  startTime: string;
  endTime: string;
  teacher: string;
  color: ClassColor;
  className?: string;
}

/** کارت یک کلاس: نام کلاس، ساعت، نام معلم */
export function ClassEventCard({
  name,
  startTime,
  endTime,
  teacher,
  color,
  className,
}: ClassEventCardProps) {
  return (
    <div
      className={cn(
        "space-y-2 rounded-xl px-2 py-3 text-center",
        color.card,
        className
      )}
    >
      <p className="truncate text-xs font-bold" title={name}>
        {name}
      </p>
      <p className="text-[10px] opacity-70" dir="ltr">
        {toPersianDigits(formatClassTime(startTime))} _{" "}
        {toPersianDigits(formatClassTime(endTime))}
      </p>
      <p className="truncate text-[11px] font-medium" title={teacher}>
        {teacher}
      </p>
    </div>
  );
}
