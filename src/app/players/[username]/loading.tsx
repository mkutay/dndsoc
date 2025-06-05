import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      {/* Profile header section */}
      <div className="flex lg:flex-row flex-col gap-6">
        <Skeleton className="lg:w-36 lg:h-36 w-48 h-48 rounded-full lg:mx-0 mx-auto" />
        <div className="flex flex-col mt-3 max-w-prose gap-1.5">
          <Skeleton className="h-12 w-64" /> {/* Player name */}
          <Skeleton className="h-6 w-24" /> {/* Level */}
          <Skeleton className="h-6 w-2/3" /> {/* About section */}
          <Skeleton className="h-10 w-32 mt-2" /> {/* Edit button */}
        </div>
      </div>
      
      {/* Characters section */}
      <div className="mt-8">
        <Skeleton className="h-8 w-32 mb-4" />
        <div className="flex flex-row gap-2 w-full items-center flex-wrap">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
      
      {/* Achievements section */}
      <div className="mt-8">
        <Skeleton className="h-8 w-48 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-48 w-full rounded-md" />
          <Skeleton className="h-48 w-full rounded-md" />
        </div>
      </div>
      
      {/* Campaigns section */}
      <div className="mt-8">
        <Skeleton className="h-8 w-36 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-60 w-full rounded-md" />
          <Skeleton className="h-60 w-full rounded-md" />
          <Skeleton className="h-60 w-full rounded-md hidden lg:block" />
        </div>
      </div>
    </div>
  );
}
