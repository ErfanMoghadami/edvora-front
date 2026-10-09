import { cn } from "@/lib/utils";

type SkeletonVariant = "text" | "circular" | "rectangular" | "rounded";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
}

const variantStyles: Record<SkeletonVariant, string> = {
  text: "h-4 w-full rounded",
  circular: "rounded-full",
  rectangular: "rounded-none",
  rounded: "rounded-lg",
};

export function Skeleton({
  className,
  variant = "rounded",
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-muted",
        variantStyles[variant],
        className
      )}
      aria-busy="true"
      aria-label="در حال بارگذاری"
      {...props}
    />
  );
}