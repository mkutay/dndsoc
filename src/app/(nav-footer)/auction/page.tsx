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

/* 
Meaning for the auction status type:
"deleted": Deleted auction
"created": Auction created but not yet approved
"listing_approved": Auction listing approved by DM/admin and is visible
"buy_request": Another person has requested to buy the auction item in return for another thingy
"signed_off": Auction has been signed off by both characters
"deal_completed": Deal has been completed and approved by both DMs/admin of the characters -- the auction is now closed
*/

export default async function Page() {
  const result = await getAll();
  if (result.isErr()) return <ErrorPage error={result.error} caller="/auction/page.tsx" />;

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
                    : auction.status === "buy_request"
                      ? "Someone has requested to buy this auction item."
                      : null}
                </p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {auction.sold_thingy.tags.slice(0, 3).map((tag) => (
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
                <Link href={`/auction/${auction.sold_thingy.shortened}`} className="flex items-center gap-0.5">
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
      .from("auction")
      .select(
        "*, sold_thingy:thingy!auction_seller_thingy_id_fkey(*), counter_thingy:thingy!auction_buyer_thingy_id_fkey(*)",
      )
      .eq("valid", true)
      .or("status.eq.buy_request,status.eq.listing_approved"),
  );
