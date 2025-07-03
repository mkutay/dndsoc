import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      {/* Journal heading */}
      <Skeleton className="lg:h-11 h-9 w-48 mb-4" />

      {/* Optional "Write a New Journal" button */}
      {/* <Skeleton className="h-10 w-48 mt-4" /> */}

      {/* Journal entries */}
      <div className="flex flex-col gap-6 mt-10">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index}>
            {/* Journal entry */}
            <div className="space-y-4">
              {/* Title with drop cap styling */}
              <div className="flex flex-row items-start">
                <Skeleton className="md:h-12 h-10 md:w-12 w-10 mr-1" /> {/* Drop cap */}
                <Skeleton className="md:h-12 h-10 w-80" /> {/* Rest of title */}
              </div>

              {/* Excerpt paragraph */}
              <div className="space-y-2 max-w-prose">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-4/5" />
                <Skeleton className="h-5 w-3/5" />
              </div>

              {/* Campaign and date info */}
              <Skeleton className="h-4 w-64 mt-2" />

              {/* Read more button */}
              <Skeleton className="h-10 w-24 mt-6" />
            </div>

            {/* Horizontal rule separator (except for last item) */}
            {index !== 2 && <Skeleton className="h-0.5 w-full mt-6" />}
          </div>
        ))}
      </div>
    </div>
  );
}
