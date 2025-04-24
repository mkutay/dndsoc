import { Skeleton } from "@/components/ui/skeleton";
import { TypographyH3 } from "@/components/typography/headings";

export default function Loading() {
  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose my-12 px-4">
      <Skeleton className="lg:h-11 h-9 w-48" />
      
      <Skeleton className="h-6 w-24 mt-1.5" />
      <Skeleton className="h-6 w-2/3 mt-1.5" />
      
      {/* Characters section */}
      <div className="flex flex-col gap-1 mt-4">
        <TypographyH3>
          <Skeleton className="h-6 w-24" />
        </TypographyH3>
        <div className="flex flex-row gap-2 w-full items-center flex-wrap">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
      
      {/* Campaigns section */}
      <Skeleton className="h-10 w-60 mt-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <Skeleton className="h-60 w-full rounded-md" />
        <Skeleton className="h-60 w-full rounded-md" />
        <Skeleton className="h-60 w-full rounded-md hidden lg:block" />
      </div>
      
      {/* Achievements section */}
      <Skeleton className="h-10 w-60 mt-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <Skeleton className="h-48 w-full rounded-md" />
        <Skeleton className="h-48 w-full rounded-md" />
      </div>
    </div>
  );
}
