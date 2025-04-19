import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose my-12 px-4">
      <Skeleton className="h-12 w-48" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="border shadow-sm">
            <CardHeader>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-20" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-16 w-full" />
            </CardContent>
            <CardFooter className="flex flex-row justify-end">
              <Skeleton className="h-9 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}