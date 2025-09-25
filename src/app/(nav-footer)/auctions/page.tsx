import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ArrowRight } from "lucide-react";
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
  if (result.isErr()) return <ErrorPage error={result.error} caller="/auctions/page.tsx" />;

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      <TypographyH1>Auction</TypographyH1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {result.value.map((auction, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{auction.sold_thingy.name}</CardTitle>
              <CardDescription>
                <p>
                  {auction.status === "listing_approved"
                    ? "Listing is approved and live."
                    : auction.status === "offer_accepted"
                      ? "An offer has been accepted for this auction item."
                      : null}
                </p>
                {auction.counter_offers.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {auction.counter_offers.length} offer{auction.counter_offers.length !== 1 ? "s" : ""} received
                  </p>
                )}
                <div className="flex flex-wrap gap-1 mt-3">
                  {auction.sold_thingy.tags.slice(0, 3).map((tag: string) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                  {auction.sold_thingy.tags.length > 3 && (
                    <Badge>
                      <DotsHorizontalIcon />
                    </Badge>
                  )}
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TypographyParagraph>{truncateText(auction.sold_thingy.description, 120)}</TypographyParagraph>
            </CardContent>
            <CardFooter className="flex flex-row justify-end">
              <Button asChild size="xs" variant="ghost" className="font-quotes">
                <Link href={`/auctions/${auction.sold_thingy.shortened}`} className="flex items-center gap-0.5">
                  View Listing <ArrowRight size={20} />
                </Link>
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
    supabase
      .from("auctions")
      .select(
        `
        *,
        sold_thingy:thingy!auction_seller_thingy_id_fkey(*),
        counter_offers:auction_offers(*, thingy(*))
        `,
      )
      .is("next", null)
      .neq("status", "created")
      .neq("status", "listing_rejected")
      .neq("status", "withdrawn")
      .neq("status", "trade_rejected")
      .neq("status", "trade_approved")
      .neq("auction_offers.status", "rejected")
      .neq("auction_offers.status", "withdrawn"),
  );
