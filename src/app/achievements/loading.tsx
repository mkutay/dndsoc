import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  // Create an array of placeholder cards (matching the typical grid size)
  const placeholders = Array.from({ length: 12 }, (_, index) => index);

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      {/* Heading placeholder */}
      <Skeleton className="h-12 w-72" />

      {/* Grid of skeleton blocks */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        {placeholders.map((index) => (
          <Skeleton key={index} className="h-48" />
        ))}
      </div>
    </div>
  );
}
