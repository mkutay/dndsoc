import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      {/* Username heading skeleton */}
      <Skeleton className="h-10 w-64 mb-4" />
      
      {/* Role form skeleton */}
      <div className="space-y-6 max-w-prose mt-6">
        <div className="flex flex-col space-y-2">
          <Skeleton className="h-4 w-16 mb-1" /> {/* Form label */}
          <Skeleton className="h-10 w-[250px]" /> {/* Role selector */}
          <Skeleton className="h-4 w-48 mt-1" /> {/* Description */}
        </div>
        <Skeleton className="h-10 w-24" /> {/* Button */}
      </div>
    </div>
  );
}
