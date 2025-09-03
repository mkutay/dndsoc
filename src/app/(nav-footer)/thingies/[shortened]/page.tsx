import { errAsync, okAsync, safeTry } from "neverthrow";
import type { Metadata } from "next";
import { cache } from "react";

import Link from "next/link";
import { TypographyLink, TypographyParagraph, TypographySmall } from "@/components/typography/paragraph";
import { TypographyH1 } from "@/components/typography/headings";
import { ErrorPage } from "@/components/error-page";
import { truncateText } from "@/utils/formatting";
import { EditThingy } from "@/components/thingies/edit-thingy";
import { Badge } from "@/components/ui/badge";
import { TypographyHr } from "@/components/typography/blockquote";
import { runQuery } from "@/utils/supabase-run";
import { getUserRole } from "@/lib/roles";
import { PutOnAuction } from "@/components/thingies/put-on-auction";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

const getThingyByShortened = cache((shortened: string) =>
  runQuery((supabase) =>
    supabase
      .from("thingy")
      .select("*, characters(*, players(auth_user_uuid))")
      .eq("shortened", shortened)
      .is("next", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .single(),
  ),
);

const getAuctionByThingyId = (id: string) =>
  runQuery((supabase) =>
    supabase.from("auctions").select("*").eq("seller_thingy_id", id).neq("status", "listing_rejected").is("next", null),
  ).andThen((auction) =>
    auction.length > 1
      ? errAsync({
          code: "THINGY_AUCTION_CONFLICT" as const,
          message: "This thingy is in multiple auctions.",
        })
      : okAsync(auction.length === 0 ? null : auction[0]),
  );

const getOffers = ({ thingyId }: { thingyId: string }) =>
  runQuery((supabase) => supabase.from("auction_offers").select("*").eq("thingy_id", thingyId).is("next", null));

export async function generateMetadata({ params }: { params: Promise<{ shortened: string }> }): Promise<Metadata> {
  const { shortened } = await params;
  const result = await getThingyByShortened(shortened);
  if (result.isErr()) return { title: "Thingy Not Found" };
  const thingy = result.value;

  const description = truncateText(thingy.description, 160);

  return {
    title: thingy.name,
    description,
    openGraph: {
      title: thingy.name,
      description,
    },
  };
}

export default async function Page({ params }: { params: Promise<{ shortened: string }> }) {
  const { shortened } = await params;

  const result = await safeTry(async function* () {
    const thingy = yield* await getThingyByShortened(shortened);
    const user = yield* await getUserRole().orElse((err) =>
      err.code === "NOT_LOGGED_IN" ? okAsync(null) : errAsync(err),
    );
    const auction = yield* await getAuctionByThingyId(thingy.id);
    const offers = yield* await getOffers({ thingyId: thingy.id });

    return okAsync({ thingy, user, auction, offers });
  });

  if (result.isErr()) return <ErrorPage error={result.error} isForbidden />;

  const { thingy, user, auction } = result.value;

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      {thingy.characters ? (
        <TypographySmall>
          <TypographyLink href={`/characters/${thingy.characters.shortened}`}>
            Owned by {thingy.characters.name}
          </TypographyLink>
        </TypographySmall>
      ) : null}
      <div className="flex flex-row flex-wrap justify-between gap-6 items-center">
        <TypographyH1>{thingy.name}</TypographyH1>
        {user &&
        (user.role === "admin" ||
          user.role === "dm" ||
          user.auth_user_uuid === thingy.characters?.players?.auth_user_uuid) &&
        thingy.character_id ? (
          <div className="flex flex-row gap-2">
            {auction ? (
              <Button asChild variant="secondary">
                <Link href={`/auction/${shortened}`}>View Auction</Link>
              </Button>
            ) : (
              <PutOnAuction thingyId={thingy.id} shortened={shortened} />
            )}
            <EditThingy thingy={thingy} auctionStatus={auction?.status} />
          </div>
        ) : null}
      </div>
      {thingy.tags.length !== 0 && (
        <div className="flex flex-wrap gap-1 max-w-lg mt-6">
          {thingy.tags.map((tag) => (
            <Badge key={tag} variant="default">
              {tag}
            </Badge>
          ))}
        </div>
      )}
      <TypographyHr className="my-12" />
      <TypographyParagraph className="max-w-prose text-lg not-first:mt-0">{thingy.description}</TypographyParagraph>
    </div>
  );
}
