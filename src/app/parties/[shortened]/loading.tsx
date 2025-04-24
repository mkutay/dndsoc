import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose my-12 px-4">
      <div className="flex flex-row">
        <Skeleton className="h-6 w-36 mb-2" />
      </div>
      <div className="flex flex-row justify-between items-center">
        <Skeleton className="lg:h-11 h-9 w-64" />
      </div>
      <Skeleton className="h-5 w-24 mt-2 mb-4" />
      <Skeleton className="h-6 w-2/3 mb-6" />

      {/* Campaigns section */}
      <div className="mt-6 flex flex-col gap-4">
        <div className="flex flex-row gap-4 items-center">
          <Skeleton className="h-8 w-36" /> {/* Current Campaign text */}
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="flex flex-row gap-4 items-center">
          <Skeleton className="h-8 w-28" /> {/* Campaigns text */}
          <div className="flex flex-row gap-2">
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-9 w-28" />
          </div>
        </div>
      </div>

      {/* Characters section */}
      <div className="mt-8">
        <Skeleton className="h-8 w-36" />
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 mt-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-52 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
