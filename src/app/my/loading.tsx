import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      {/* Page title skeleton */}
      <Skeleton className="lg:h-11 h-9 w-48" />

      {/* Two-column grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* ProfileLinks card skeleton */}
        <Skeleton className="h-80 w-full rounded-lg" />

        {/* MyProfile card skeleton */}
        <Skeleton className="h-80 w-full rounded-lg" />
      </div>

      {/* Characters section skeleton */}
      <div className="mt-12 space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-40" /> {/* Section title */}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Character cards */}
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-60 w-full rounded-lg" />
          ))}

          {/* Create Character card skeleton */}
          <Skeleton className="h-60 w-full rounded-lg" />
        </div>
      </div>

      {/* Parties section skeleton */}
      <div className="mt-12 space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-44" /> {/* Section title */}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Party cards */}
          {Array.from({ length: 2 }).map((_, index) => (
            <Skeleton key={index} className="h-60 w-full rounded-md" />
          ))}
        </div>
      </div>
    </div>
  );
}
