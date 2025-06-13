import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      {/* Header section with avatar and DM info */}
      <div className="flex lg:flex-row flex-col gap-6">
        <Skeleton className="lg:w-36 lg:h-36 w-48 h-48 rounded-full lg:mx-0 mx-auto" />
        <div className="flex flex-col mt-3 max-w-prose gap-1.5">
          <Skeleton className="h-14 w-80" /> {/* DM name */}
          <Skeleton className="h-6 w-24" /> {/* Level */}
          <Skeleton className="h-6 w-2/3" /> {/* About text */}
          <Skeleton className="h-10 w-20 mt-2" /> {/* Edit button */}
        </div>
      </div>

      {/* Achievements section */}
      <Skeleton className="h-10 w-40 mt-6" /> {/* "Achievements" heading */}
      <div className="flex flex-wrap gap-4 mt-6">
        <Skeleton className="h-16 w-64 rounded-2xl" />
        <Skeleton className="h-16 w-72 rounded-2xl" />
        <Skeleton className="h-16 w-64 rounded-2xl" />
      </div>
      
      {/* Parties section */}
      <div className="mt-6 flex flex-col">
        <Skeleton className="h-10 w-20" /> {/* "Parties" heading */}
        <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 mt-6">
          <Skeleton className="h-60 w-full rounded-md" />
          <Skeleton className="h-60 w-full rounded-md" />
          <Skeleton className="h-60 w-full rounded-md hidden lg:block" />
        </div>
      </div>
      
      {/* Campaigns section */}
      <Skeleton className="h-10 w-32 mt-8" /> {/* "Campaigns" heading */}
      <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 mt-6">
        <Skeleton className="h-60 w-full rounded-md" />
        <Skeleton className="h-60 w-full rounded-md" />
        <Skeleton className="h-60 w-full rounded-md hidden lg:block" />
      </div>
    </div>
  );
}
