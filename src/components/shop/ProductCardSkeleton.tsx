import { Skeleton } from "@/components/ui/skeleton";

export default function ProductCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card">
      <Skeleton className="aspect-square w-full rounded-t-2xl rounded-b-none" />
      <div className="p-4 flex flex-col gap-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-24 mt-2" />
      </div>
    </div>
  );
}