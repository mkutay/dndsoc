import { errAsync, okAsync } from "neverthrow";
import type { Metadata } from "next";
import { cache } from "react";
import Link from "next/link";

import { runQuery } from "@/utils/supabase-run";
import { ErrorPage } from "@/components/error-page";
import { truncateText } from "@/utils/formatting";
import { TypographyH1 } from "@/components/typography/headings";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TypographyHr } from "@/components/typography/blockquote";
import { statusMeaning, statusPretty, statusVariant } from "@/config/auction";

const get = cache((shortened: string) =>
  runQuery((supabase) =>
    supabase
      .from("auction")
      .select("*, sold_thingy:thingy!auction_seller_thingy_id_fkey!inner(*)")
      .eq("sold_thingy.shortened", shortened)
      .eq("valid", true),
  ).andThen((result) =>
    result.length === 1
      ? okAsync(result[0])
      : errAsync({
          message: "Auction not found. " + result.length,
          code: "NOT_FOUND" as const,
        }),
  ),
);

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
      <Badge variant={statusVariant[auction.status]} className="w-fit mb-2 text-sm px-3.5 py-1">
        {statusPretty[auction.status]}
      </Badge>
      <div className="flex flex-row flex-wrap justify-between gap-2 items-center">
        <TypographyH1>Auction: {auction.sold_thingy.name}</TypographyH1>
        <Button asChild size="default" variant="secondary">
          <Link href={`/thingies/${auction.sold_thingy.shortened}`}>View Thingy</Link>
        </Button>
      </div>
      <p className="text-muted-foreground text-lg mt-2">{statusMeaning[auction.status]}</p>
      <TypographyHr className="sm:my-12 my-8" />
      <p className="text-lg max-w-prose">
        {auction.sold_thingy.description !== "" ? (
          truncateText(auction.sold_thingy.description, 300)
        ) : (
          <span className="italic text-muted-foreground">No description provided.</span>
        )}
      </p>
    </div>
  );
}
