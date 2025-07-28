import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      {/* Journal title skeleton */}
      <Skeleton className="lg:h-11 h-9 w-[600px] mb-2" />

      {/* Date skeleton */}
      <div className="text-right mt-2">
        <Skeleton className="h-6 w-32 ml-auto" />
      </div>

      {/* Optional admin edit button skeleton */}
      {/* <div className="flex flex-row justify-end w-full mt-4">
        <Skeleton className="h-9 w-28" />
      </div> */}

      {/* Party entries skeleton */}
      <div className="flex flex-col gap-6 mt-6">
        {/* First party entry */}
        <div className="flex flex-col gap-2">
          {/* Entry text skeleton */}
          <div className="max-w-prose">
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-5/6 mb-2" />
            <Skeleton className="h-6 w-4/5" />
          </div>

          {/* Party name link skeleton */}
          <div className="flex flex-row items-center text-md italic font-quotes mt-2">
            <Skeleton className="h-5 w-40" />
          </div>

          {/* Optional edit entry button skeleton */}
          {/* <div className="flex flex-row justify-end w-full mt-2">
            <Skeleton className="h-9 w-24" />
          </div> */}
        </div>

        {/* Horizontal separator skeleton */}
        <Skeleton className="h-0.5 w-full" />

        {/* Second party entry */}
        <div className="flex flex-col gap-2">
          <div className="max-w-prose">
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-6 w-5/6" />
          </div>

          <div className="flex flex-row items-center text-md italic font-quotes mt-2">
            <Skeleton className="h-5 w-36" />
          </div>

          {/* <div className="flex flex-row justify-end w-full mt-2">
            <Skeleton className="h-9 w-24" />
          </div> */}
        </div>

        {/* Horizontal separator skeleton */}
        <Skeleton className="h-0.5 w-full" />

        {/* Third party entry */}
        <div className="flex flex-col gap-2">
          <div className="max-w-prose">
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-4/5" />
          </div>

          <div className="flex flex-row items-center text-md italic font-quotes mt-2">
            <Skeleton className="h-5 w-44" />
          </div>

          {/* <div className="flex flex-row justify-end w-full mt-2">
            <Skeleton className="h-9 w-24" />
          </div> */}
        </div>
      </div>
    </div>
  );
}
