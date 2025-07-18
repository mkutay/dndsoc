import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="lg:max-w-6xl max-w-prose mx-auto px-4 my-12">
      {/* Go Back link skeleton */}
      <Skeleton className="h-4 w-20 mb-2" />

      {/* Title skeleton */}
      <Skeleton className="lg:h-12 h-10 lg:w-[520px] w-full mb-2" />

      {/* Subtitle skeleton */}
      <Skeleton className="h-6 w-96 mb-8" />

      <Skeleton className="h-4 w-64 mb-6" />

      {/* Form container skeleton */}
      <div className="space-y-6 max-w-prose">
        {/* Title input skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Date range picker skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-[400px] w-full" />
        </div>

        {/* Deadline picker skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-48" />
        </div>

        {/* Form buttons skeleton */}
        <div className="flex space-x-2 pt-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>
    </div>
  );
}
