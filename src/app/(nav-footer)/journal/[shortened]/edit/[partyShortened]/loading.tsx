import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      {/* Go Back to Entry link skeleton */}
      <Skeleton className="h-6 w-36 mb-4" />

      {/* Page heading skeleton */}
      <Skeleton className="lg:h-11 h-9 w-80 mb-6" />

      {/* Form skeleton */}
      <div className="space-y-6 max-w-prose mt-6">
        {/* Entry field skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-12" /> {/* Form label */}
          <Skeleton className="h-40 w-full" /> {/* Textarea */}
          <Skeleton className="h-4 w-72" /> {/* Form description */}
        </div>

        {/* Buttons skeleton */}
        <div className="flex flex-row gap-2">
          <Skeleton className="h-10 w-20" /> {/* Submit button */}
          <Skeleton className="h-10 w-10" /> {/* Reset button */}
        </div>
      </div>
    </div>
  );
}
