import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      {/* Title skeleton */}
      <Skeleton className="h-12 w-[20ch]" />
      
      {/* Date range skeleton */}
      <Skeleton className="h-6 w-[24ch] mt-2" />
      
      <Skeleton className="h-5 w-2/3 mt-6" />
    </div>
  );
}
