import { Skeleton } from "@/components/ui/skeleton";

export function ShareSkeleton() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <div className="space-y-3 text-center">
        <Skeleton className="mx-auto h-16 w-16" variant="circular" />
        <Skeleton className="mx-auto h-7 w-48" />
        <Skeleton className="mx-auto h-4 w-64" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="space-y-2 rounded-xl border border-border p-4 text-center"
          >
            <Skeleton className="mx-auto h-8 w-8 rounded-full" />
            <Skeleton className="mx-auto h-6 w-20" />
            <Skeleton className="mx-auto h-3 w-16" />
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border">
        <div className="border-b border-border p-4">
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="divide-y divide-border">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}