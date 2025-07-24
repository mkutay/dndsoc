import { errAsync, okAsync } from "neverthrow";
import type { Metadata } from "next";
import { cache } from "react";

import Link from "next/link";
import { runQuery } from "@/utils/supabase-run";
import { ErrorPage } from "@/components/error-page";
import { truncateText } from "@/utils/formatting";
import { TypographyH1 } from "@/components/typography/headings";
import type { Enums } from "@/types/database.types";
import { Badge } from "@/components/ui/badge";
import { TypographyParagraph } from "@/components/typography/paragraph";
import { Button } from "@/components/ui/button";

const get = cache((shortened: string) =>
  runQuery((supabase) =>
    supabase
      .from("auction")
      .select("*, sold_thingy:thingy!auction_seller_thingy_id_fkey(*)")
      .eq("valid", true)
      .eq("sold_thingy.shortened", shortened),
  ).andThen((result) =>
    result.length === 1
      ? okAsync(result[0])
      : errAsync({
          message: "Auction not found.",
          code: "NOT_FOUND" as const,
        }),
  ),
);

const statusPretty: Record<Enums<"auction_state">, string> = {
  created: "Created",
  deleted: "Deleted",
  listing_approved: "Listing Approved",
  buy_request: "Buy Request",
  signed_off: "Signed Off",
  deal_completed: "Deal Completed",
};

const statusVariant: Record<Enums<"auction_state">, "default" | "secondary" | "destructive"> = {
  created: "secondary",
  deleted: "destructive",
  listing_approved: "default",
  buy_request: "default",
  signed_off: "default",
  deal_completed: "default",
};

const statusMeaning: Record<Enums<"auction_state">, string> = {
  created: "Auction created but not yet approved.",
  deleted: "Deleted auction.",
  listing_approved: "Auction listing approved by DM/admin and is visible.",
  buy_request: "Another person has requested to buy the auction item in return for another thingy.",
  signed_off: "Auction has been signed off by both characters.",
  deal_completed:
    "Deal has been completed and approved by both DMs/admin of the characters. The auction is now closed.",
};

export async function generateMetadata({ params }: { params: Promise<{ shortened: string }> }): Promise<Metadata> {
  const { shortened } = await params;
  const result = await get(shortened);
  if (result.isErr()) return { title: "Auction Not Found" };
  const auction = result.value;

  const description = truncateText(auction.sold_thingy.description, 100);

  return {
    title: `Auction for ${auction.sold_thingy.name}`,
    description,
    openGraph: {
      title: `Auction for ${auction.sold_thingy.name}`,
      description,
    },
  };
}

export default async function Page({ params }: { params: Promise<{ shortened: string }> }) {
  const { shortened } = await params;
  const result = await get(shortened);
  if (result.isErr()) return <ErrorPage error={result.error} caller="/auction/[shortened]/page.tsx" />;
  const auction = result.value;

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      <Badge variant={statusVariant[auction.status]} className="w-fit mb-1 text-sm px-3.5 py-1">
        {statusPretty[auction.status]}
      </Badge>
      <div className="flex flex-row flex-wrap justify-between items-center">
        <TypographyH1>Auction: {auction.sold_thingy.name}</TypographyH1>
        <Button asChild size="default" variant="secondary">
          <Link href={`/thingies/${auction.sold_thingy.shortened}`}>View Thingy</Link>
        </Button>
      </div>
      <TypographyParagraph className="text-muted-foreground text-lg">
        {statusMeaning[auction.status]}
      </TypographyParagraph>
    </div>
  );
}
