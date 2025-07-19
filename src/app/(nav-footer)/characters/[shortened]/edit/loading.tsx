import { Skeleton } from "@/components/ui/skeleton";
import { TypographyH1 } from "@/components/typography/headings";

export default function Loading() {
  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      <Skeleton className="h-6 w-20" />
      <TypographyH1 className="mt-2">
        <Skeleton className="inline-block lg:h-11 h-9 w-[600px]" />
      </TypographyH1>

      <div className="space-y-6 max-w-prose mt-6">
        {/* About field */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-4 w-40" />
        </div>

        {/* Level field */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-4 w-56" />
        </div>

        {/* Race field */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-4 w-52" />
        </div>

        {/* Classes fields */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-9 w-28" />
        </div>

        {/* Buttons */}
        <div className="flex flex-row gap-2">
          <Skeleton className="h-10 w-20" />
        </div>
      </div>
    </div>
  );
}
