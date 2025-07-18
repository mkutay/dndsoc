import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      {/* Go Back Link */}
      <Skeleton className="h-6 w-32 mb-4" />

      {/* Page Title */}
      <Skeleton className="h-10 w-64 mb-6" />

      {/* Form Container */}
      <div className="space-y-6 max-w-prose mt-6">
        {/* Excerpt Field */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-[160px] w-full" />
          <Skeleton className="h-3 w-48" />
        </div>

        {/* Title Field */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-3 w-40" />
        </div>

        {/* Shortened Field */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-3 w-56" />
        </div>

        {/* Date Field */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-10 w-60" />
          <Skeleton className="h-3 w-44" />
        </div>

        {/* Party Entries Section */}
        <div className="flex flex-col gap-4">
          <Skeleton className="h-6 w-32" />

          {/* Party Entry 1 */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-[160px] w-full" />
          </div>

          {/* Party Entry 2 */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-52" />
            <Skeleton className="h-[160px] w-full" />
          </div>

          {/* Party Entry 3 */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-[160px] w-full" />
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex flex-row gap-2">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>
    </div>
  );
}
