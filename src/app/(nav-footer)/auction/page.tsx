import Link from "next/link";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TypographyH1 } from "@/components/typography/headings";
import { runQuery } from "@/utils/supabase-run";
import { ErrorPage } from "@/components/error-page";
import { Badge } from "@/components/ui/badge";
import { TypographyParagraph } from "@/components/typography/paragraph";
import { truncateText } from "@/utils/formatting";
import { Button } from "@/components/ui/button";

export default async function Page() {
  const result = await getAll();
  if (result.isErr()) return <ErrorPage error={result.error} caller="/trades/page.tsx" />;

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      <TypographyH1>Auction</TypographyH1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {result.value.map((auction, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{auction.thingy.name}</CardTitle>
              <CardDescription className="flex flex-wrap gap-2">
                {auction.thingy.tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TypographyParagraph>{truncateText(auction.thingy.description, 100)}</TypographyParagraph>
            </CardContent>
            <CardFooter className="flex flex-row justify-end">
              <Button asChild size="sm" variant="default">
                <Link href={`/auction/${auction.thingy.shortened}`}>View Thingy</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

const getAll = () =>
  runQuery((supabase) =>
    supabase.from("auction").select("*, thingy(*)").eq("valid", true).eq("status", "listing_approved"),
  );
