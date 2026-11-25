import { toPersianDigits } from "@/lib/utils";

interface SectionTitleProps {
  step: number;
  title: string;
  aside?: React.ReactNode;
}

export function SectionTitle({ step, title, aside }: SectionTitleProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
          {toPersianDigits(step)}
        </span>
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
      </div>
      {aside && <div className="text-xs text-muted-foreground">{aside}</div>}
    </div>
  );
}
