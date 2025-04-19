import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose my-12 px-4">
      <Skeleton className="h-12 w-72" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="border">
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2 mt-1" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter className="flex flex-row justify-end">
              <Skeleton className="h-8 w-32" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
