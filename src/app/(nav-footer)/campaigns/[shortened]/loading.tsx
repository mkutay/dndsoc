import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      {/* Custom title skeleton with drop-caps design */}
      <div className="flex flex-row items-start">
        <Skeleton className="lg:h-[84px] h-[70px] w-[60px] lg:w-[70px]" /> {/* Drop cap */}
        <Skeleton className="lg:h-12 h-10 w-[15ch] ml-1 mt-2" /> {/* Rest of title */}
      </div>

      {/* Date range skeleton */}
      <Skeleton className="h-6 w-[24ch] mt-2" />

      {/* Description skeleton */}
      <Skeleton className="h-5 w-2/3 mt-6" />

      {/* Parties section skeleton */}
      <div className="mt-6 flex flex-col">
        {/* Section heading skeleton */}
        <Skeleton className="h-9 w-20" />

        {/* Grid of party cards skeleton */}
        <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 mt-6">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-48 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
