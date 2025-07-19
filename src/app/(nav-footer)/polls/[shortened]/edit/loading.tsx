import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      {/* Go Back Link */}
      <Skeleton className="h-6 w-20 mb-4" />

      {/* Page Title */}
      <Skeleton className="h-10 w-32 mb-6" />

      {/* Form Container */}
      <div className="space-y-6 max-w-prose mt-6">
        {/* Question Field */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-3 w-48" />
        </div>

        {/* Shortened Field */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-3 w-64" />
        </div>

        {/* Expires At Field */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <div className="flex flex-row gap-2 items-center">
            <Skeleton className="h-10 w-60" />
            <Skeleton className="h-10 w-10" />
          </div>
          <Skeleton className="h-3 w-72" />
        </div>

        {/* Options Section */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-40" />

          {/* Option 1 */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <div className="flex flex-row gap-2 items-center">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-10" />
            </div>
          </div>

          {/* Option 2 */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <div className="flex flex-row gap-2 items-center">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-10" />
            </div>
          </div>

          {/* Add Option Button */}
          <Skeleton className="h-10 w-32" />
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
