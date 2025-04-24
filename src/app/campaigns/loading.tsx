import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  // Create an array of placeholder cards
  const placeholders = Array.from({ length: 3 }, (_, index) => index);

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      {/* Heading placeholder */}
      <Skeleton className="h-12 w-32" />
      
      {/* Grid of skeleton placeholders */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {placeholders.map((index) => (
          <Skeleton key={index} className="h-56" />
        ))}
      </div>
    </div>
  );
}