import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="md:max-w-6xl max-w-prose mx-auto px-4 my-12">
      <div className="max-w-prose lg:mx-0 mx-auto">
        <Skeleton className="lg:h-12 lg:w-[520px] h-10 w-full mb-2" />
        <Skeleton className="h-8 w-96" />
      </div>

      {/* Voted Times Section Skeleton */}
      <div className="mt-8">
        <Skeleton className="h-80 w-full mb-8" />
      </div>

      {/* Poll Vote Form Section Skeleton */}
      <Skeleton className="h-96 w-full" />
    </div>
  );
}
