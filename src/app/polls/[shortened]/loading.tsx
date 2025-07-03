import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      {/* Poll title skeleton */}
      <div className="flex flex-row flex-wrap">
        <Skeleton className="h-12 w-3/4 mr-4" />
      </div>

      {/* Date information skeleton */}
      <div className="text-right italic font-quotes text-lg mt-2">
        <Skeleton className="h-6 w-40 ml-auto mb-1" />
        <Skeleton className="h-6 w-36 ml-auto" />
      </div>

      {/* Edit button skeleton (for admin) */}
      {/* <div className="flex flex-row justify-end w-full mt-4">
        <Skeleton className="h-10 w-20" />
      </div> */}

      {/* Options skeleton */}
      <div className="flex flex-col gap-6 mt-6">
        {/* First option */}
        <div className="flex flex-col gap-2 max-w-prose">
          <Skeleton className="h-12 w-full" /> {/* Option text */}
          <Skeleton className="h-6 w-24" /> {/* Vote count */}
          <Skeleton className="h-10 w-[100px] mt-3" /> {/* Vote button */}
        </div>

        {/* Horizontal separator */}
        <Skeleton className="h-0.5 w-full" />

        {/* Second option */}
        <div className="flex flex-col gap-2 max-w-prose">
          <Skeleton className="h-12 w-5/6" /> {/* Option text */}
          <Skeleton className="h-6 w-24" /> {/* Vote count */}
          <Skeleton className="h-10 w-[100px] mt-3" /> {/* Vote button */}
        </div>

        {/* Horizontal separator */}
        <Skeleton className="h-0.5 w-full" />

        {/* Third option */}
        <div className="flex flex-col gap-2 max-w-prose">
          <Skeleton className="h-12 w-4/5" /> {/* Option text */}
          <Skeleton className="h-6 w-24" /> {/* Vote count */}
          <Skeleton className="h-10 w-[100px] mt-3" /> {/* Vote button */}
        </div>
      </div>
    </div>
  );
}
