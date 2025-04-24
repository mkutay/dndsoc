import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      <Skeleton className="lg:h-11 h-9 w-36" />
      <div className="space-y-6 max-w-prose mt-6">
        {/* Name field skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-4 w-48" />
        </div>
        
        {/* Level field skeleton - DM form */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-4 w-48" />
        </div>
        
        {/* About field skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-4 w-48" />
        </div>
        
        {/* Characters section skeleton - DM form */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-9 w-36" />
        </div>
        
        {/* Button skeleton */}
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
}
