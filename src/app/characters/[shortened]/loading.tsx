import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose my-12 px-4">
      <Skeleton className="h-3.5 w-36" />
      <Skeleton className="lg:h-11 h-9 w-80 mt-2" />
      
      <Skeleton className="h-6 w-96 mt-1.5" />
      <Skeleton className="h-6 w-2/3 mt-4" />
      
      {/* Campaigns section */}
      <Skeleton className="h-10 w-60 mt-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <Skeleton className="h-60 w-full rounded-md" />
        <Skeleton className="h-60 w-full rounded-md" />
        <Skeleton className="h-60 w-full rounded-md hidden lg:block" />
      </div>
    </div>
  );
}
