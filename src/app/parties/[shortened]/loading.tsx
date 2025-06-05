import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      {/* Header section with avatar and party info */}
      <div className="flex lg:flex-row flex-col gap-6">
        {/* Avatar skeleton */}
        <Skeleton className="lg:w-36 lg:h-36 w-48 h-48 rounded-full lg:mx-0 mx-auto" />
        
        {/* Party info skeleton */}
        <div className="flex flex-col mt-3 max-w-prose gap-1.5">
          {/* DM info */}
          <Skeleton className="h-5 w-40 mb-1" />
          
          {/* Party name with drop caps styling */}
          <div className="flex flex-row items-start mb-2">
            <Skeleton className="h-20 w-16 mr-2" /> {/* Drop cap */}
            <Skeleton className="h-14 w-64 mt-1" /> {/* Rest of name */}
          </div>
          
          {/* Level */}
          <Skeleton className="h-6 w-24 mb-2" />
          
          {/* About description */}
          <Skeleton className="h-5 w-3/4 mb-2" />
          <Skeleton className="h-5 w-1/2 mb-4" />
          
          {/* Edit button */}
          <Skeleton className="h-9 w-28" />
        </div>
      </div>

      {/* Characters section */}
      <div className="mt-8">
        <Skeleton className="h-8 w-36 mb-4" />
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-52 w-full" />
          ))}
        </div>
      </div>

      {/* Campaigns section */}
      <div className="mt-8">
        <Skeleton className="h-8 w-36 mb-4" />
        <div className="flex flex-col gap-4">
          <div className="flex flex-row gap-4 items-center">
            <Skeleton className="h-8 w-36" /> {/* Current Campaign text */}
            <Skeleton className="h-9 w-32" />
          </div>
          <div className="flex flex-row gap-4 items-center">
            <Skeleton className="h-8 w-28" /> {/* All Campaigns text */}
            <div className="flex flex-row gap-2">
              <Skeleton className="h-9 w-28" />
              <Skeleton className="h-9 w-28" />
              <Skeleton className="h-9 w-28" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
