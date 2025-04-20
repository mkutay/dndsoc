import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose my-12 px-4">
      <div className="h-4 w-24">
        <Skeleton className="h-4 w-24" />
      </div>
      
      <div className="mt-2">
        <Skeleton className="lg:h-11 h-9 w-64" />
      </div>
      
      <div className="space-y-6 max-w-prose mt-6">
        <div className="space-y-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-4 w-48" />
        </div>
        
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
}
