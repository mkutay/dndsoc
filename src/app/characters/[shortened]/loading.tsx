import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      <div className="flex lg:flex-row flex-col gap-6">
        {/* Avatar skeleton */}
        <Skeleton className="lg:w-36 lg:h-36 w-48 h-48 lg:mx-0 mx-auto rounded-full" />
        
        <div className="flex flex-col max-w-prose gap-1.5 mt-3">
          <div className="flex flex-col gap-1">
            {/* "Played By" text */}
            <Skeleton className="h-4 w-32" />
            {/* Character name */}
            <Skeleton className="h-14 w-80" />
          </div>
          {/* Level and class/race info */}
          <Skeleton className="h-6 w-96 mt-1.5" />
          {/* About text */}
          <Skeleton className="h-6 w-2/3 mt-4" />
          <Skeleton className="h-6 w-1/2" />
        </div>
      </div>

      {/* Achievements section */}
      <Skeleton className="h-10 w-60 mt-8" />
      <div className="flex flex-wrap gap-4 mt-6">
        <Skeleton className="h-16 w-72 rounded-2xl" />
        <Skeleton className="h-16 w-80 rounded-2xl" />
        <Skeleton className="h-16 w-80 rounded-2xl" />
      </div>

      {/* Campaigns section */}
      <Skeleton className="h-10 w-60 mt-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <Skeleton className="h-80 w-full rounded-md" />
        <Skeleton className="h-60 w-full rounded-md" />
        <Skeleton className="h-60 w-full rounded-md hidden lg:block" />
      </div>
    </div>
  );
}
