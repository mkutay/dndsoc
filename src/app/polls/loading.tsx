import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      {/* Page title skeleton */}
      <Skeleton className="h-12 w-24" />
      
      {/* Create Poll button skeleton (for admin users) */}
      {/* <Skeleton className="h-10 w-40 mt-4" /> */}
      
      <div className="mt-6 space-y-6">
        {/* Poll items skeleton */}
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="space-y-4">
            {/* Poll question skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-10 w-3/4" />
            </div>
            
            {/* Poll options skeleton */}
            <div className="pl-5 space-y-2">
              {Array.from({ length: 3 }).map((_, optionIndex) => (
                <div key={optionIndex} className="flex flex-row items-start gap-2">
                  <Skeleton className="w-4 h-4 rounded-full mt-[3px]" />
                  <Skeleton className="h-4 w-48" />
                </div>
              ))}
            </div>
            
            {/* See More button skeleton */}
            <Skeleton className="h-9 w-24" />
            
            {/* Separator line (except for last item) */}
            {index < 2 && <Skeleton className="h-0.5 w-full mt-6" />}
          </div>
        ))}
      </div>
    </div>
  );
}