import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      <Skeleton className="h-12 w-1/4" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="flex flex-col space-y-3 p-4 rounded-md">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-16 w-full" />
            <div className="flex justify-end pt-2">
              <Skeleton className="h-8 w-16" />
            </div>
          </Skeleton>
        ))}
      </div>
    </div>
  );
}
