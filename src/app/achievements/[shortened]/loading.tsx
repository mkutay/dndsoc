import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      {/* Difficulty skeleton */}
      <Skeleton className="h-4 w-32 uppercase" />
      
      {/* Achievement name skeleton */}
      <Skeleton className="lg:h-11 h-9 w-80 mt-2" />
      
      {/* Description skeleton */}
      <div className="max-w-prose mt-4">
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-3/4" />
      </div>
      
      {/* Points section skeleton */}
      <div className="mt-6 flex flex-row items-center gap-3 flex-wrap">
        <Skeleton className="h-7 w-24" /> {/* Points text */}
      </div>
      
      {/* Received achievements section skeleton */}
      <div className="mt-6">
        <div className="space-y-4">
          {/* Section heading */}
          <Skeleton className="h-8 w-48" />
          
          {/* Achievement cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-md" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}