import { errAsync, okAsync } from "neverthrow";
import type { Metadata } from "next";
import { cache, Suspense } from "react";
import Link from "next/link";

import { runQuery } from "@/utils/supabase-run";
import { ErrorPage } from "@/components/error-page";
import { truncateText } from "@/utils/formatting";
import { TypographyH1, TypographyH2 } from "@/components/typography/headings";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TypographyHr } from "@/components/typography/blockquote";
import { statusMeaning, statusPretty, statusVariant } from "@/config/auction";
import { getUser } from "@/lib/auth";
import { BuyThingySheet } from "@/components/auction/buy-thingy-sheet";
import { TypographyLink } from "@/components/typography/paragraph";
import { ApproveDenyBuyRequest } from "@/components/auction/approve-deny-buy-request";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const get = cache((shortened: string) =>
  runQuery((supabase) =>
    supabase
      .from("auctions")
      .select(
        `
        *,
        sold_thingy:thingy!auction_seller_thingy_id_fkey(*, characters(*, players(*, users(*)))),
        counter_offers:auction_offers(*, thingy(*, characters(*, players(*, users(*)))))
        `,
      )
      .eq("sold_thingy.shortened", shortened)
      .is("sold_thingy.next", null)
      .is("counter_offers.next", null)
      .is("next", null),
  ).andThen((result) =>
    result.length === 1
      ? okAsync(result[0])
      : errAsync({
          message: "Auction not found.",
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
  if (result.isErr()) return <ErrorPage error={result.error} caller="/auctions/[shortened]/page.tsx" />;
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
      <p className="text-muted-foreground text-base mt-2">{statusMeaning[auction.status]}</p>
      <TypographyHr className="sm:my-12 my-8" />
      <p className="max-w-prose text-lg">
        {auction.sold_thingy.description !== "" ? (
          truncateText(auction.sold_thingy.description, 300)
        ) : (
          <span className="italic text-muted-foreground">No description provided.</span>
        )}
      </p>
      {(() => {
        // Check if there's an accepted offer
        const acceptedOffer = auction.counter_offers.find((offer) => offer.status === "accepted");

        if (acceptedOffer) {
          return (
            <div className="sm:mt-8 mt-6">
              <p className="text-lg max-w-prose">
                A buy request has been made for this auction. The buyer is trading:{" "}
                <TypographyLink href={`/thingies/${acceptedOffer.thingy.shortened}`}>
                  {acceptedOffer.thingy.name}
                </TypographyLink>
                .
              </p>
              <p className="mt-6">You as the auction owner can approve or deny this request:</p>
              <ApproveDenyBuyRequest auctionId={auction.id} />
            </div>
          );
        }

        // No accepted offers, show the buy component
        return (
          <Suspense>
            <BuyThing auctionId={auction.id} shortened={shortened} />
          </Suspense>
        );
      })()}

      {/* Display all offers */}
      {auction.counter_offers.length > 0 && (
        <div className="mt-8">
          <TypographyH2>All Offers</TypographyH2>
          <div className="grid gap-4 mt-4">
            {auction.counter_offers.map((offer) => (
              <Card key={offer.id} className="w-full">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">
                      <TypographyLink href={`/thingies/${offer.thingy.shortened}`}>{offer.thingy.name}</TypographyLink>
                    </CardTitle>
                    <Badge
                      variant={
                        offer.status === "accepted"
                          ? "default"
                          : offer.status === "pending"
                            ? "secondary"
                            : offer.status === "rejected"
                              ? "destructive"
                              : "outline"
                      }
                    >
                      {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Amount: {offer.amount}</p>
                    {offer.thingy.description ? (
                      <p className="text-sm">{truncateText(offer.thingy.description, 150)}</p>
                    ) : null}
                    {offer.thingy.characters ? (
                      <p className="text-sm text-muted-foreground">
                        Offered by: {offer.thingy.characters.name}
                        {offer.thingy.characters.players?.users
                          ? ` (@${offer.thingy.characters.players.users.username})`
                          : ""}
                      </p>
                    ) : null}
                    <p className="text-xs text-muted-foreground">
                      Offered on: {new Date(offer.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const BuyThing = async ({ auctionId, shortened }: { auctionId: string; shortened: string }) => {
  const thingies = await getUser().andThen((user) =>
    runQuery((supabase) =>
      supabase
        .from("thingy")
        .select("*, characters!inner(*, players!inner(auth_user_uuid))")
        .eq("characters.players.auth_user_uuid", user.id)
        .is("next", null),
    ),
  );

  if (thingies.isErr()) {
    return null;
  }

  return (
    <div className="ml-auto mt-12">
      <BuyThingySheet auctionId={auctionId} thingies={thingies.value} shortened={shortened} />
    </div>
  );
};
