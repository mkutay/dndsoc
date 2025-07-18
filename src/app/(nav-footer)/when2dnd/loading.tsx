import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="lg:max-w-6xl max-w-prose mx-auto px-4 my-12">
      <div className="max-w-prose">
        {/* Title skeleton */}
        <Skeleton className="h-12 w-80 mb-4" />

        {/* Subtitle skeleton */}
        <Skeleton className="h-6 w-96 mb-8" />

        <div className="mt-8 flex flex-col gap-2">
          {/* Paragraph skeleton */}
          <Skeleton className="h-5 w-full mb-2" />
          <Skeleton className="h-5 w-3/4 mb-4" />

          {/* Form skeleton */}
          <div className="flex gap-2">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-20" />
          </div>
        </div>

        {/* Final paragraph skeleton */}
        <div className="mt-4">
          <Skeleton className="h-5 w-72" />
        </div>
      </div>
    </div>
  );
}
