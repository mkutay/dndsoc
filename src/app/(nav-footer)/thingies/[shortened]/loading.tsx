import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      <Skeleton className="h-5 w-48 mb-2" />

      <div className="flex flex-row flex-wrap justify-between gap-6 items-center">
        <Skeleton className="h-12 w-1/2" />
      </div>

      <div className="flex flex-wrap gap-1 max-w-lg mt-6">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-12" />
      </div>

      <Skeleton className="h-px w-full my-12" />

      <div className="space-y-2 max-w-prose">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}
