import { TypographyH1 } from "@/components/typography/headings";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose my-12 px-4">
      {/* Page heading skeleton */}
      <TypographyH1><Skeleton className="lg:h-11 h-9 w-64" /></TypographyH1>
      
      {/* Form skeleton */}
      <div className="space-y-8 max-w-prose mt-8">
        <div className="space-y-2">
          {/* Form label skeleton */}
          <Skeleton className="h-5 w-16" />
          {/* Textarea skeleton */}
          <Skeleton className="h-32 w-full mt-2" />
          {/* Form description skeleton */}
          <Skeleton className="h-4 w-40 mt-1" />
        </div>
        
        {/* Submit button skeleton */}
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  );
}
