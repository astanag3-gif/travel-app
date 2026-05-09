import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ExcursionCardSkeleton() {
  return (
    <Card className="overflow-hidden border border-gray-200 bg-white">
      <Skeleton className="aspect-[16/9] w-full rounded-none" />
      <div className="flex flex-col gap-3 p-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex gap-1.5">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>
      </div>
    </Card>
  );
}