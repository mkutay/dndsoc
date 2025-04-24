import { TypographyH1 } from "@/components/typography/headings";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      <TypographyH1><Skeleton className="lg:h-11 h-9 w-64" /></TypographyH1>
      <div className="space-y-8 max-w-prose mt-8">
        {/* Name field */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-3 w-40" />
        </div>

        {/* Level field */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-3 w-40" />
        </div>

        {/* About field */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-3 w-60" />
        </div>

        {/* Characters section */}
        <div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-3 w-44" />
            <Skeleton className="h-8 w-32" />
          </div>
        </div>

        {/* Campaigns section */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-3 w-60" />
          <Skeleton className="h-8 w-32" />
        </div>

        {/* DMs section */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-3 w-48" />
          <Skeleton className="h-8 w-32" />
        </div>

        {/* Submit button */}
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
}
