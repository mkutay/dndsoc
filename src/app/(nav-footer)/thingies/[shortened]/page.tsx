import type { Metadata } from "next";
import { okAsync } from "neverthrow";
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

const getThingyByShortened = (shortened: string) =>
  runQuery((supabase) =>
    supabase
      .from("thingy")
      .select("*, characters(*, players(auth_user_uuid))")
      .eq("shortened", shortened)
      .order("created_at", { ascending: false })
      .limit(1)
      .single(),
  );

const getNext = (id: string | null) =>
  id ? runQuery((supabase) => supabase.from("thingy").select("*").eq("id", id).single()) : okAsync(null);

const cachedGetThingyByShortened = cache(getThingyByShortened);

export async function generateMetadata({ params }: { params: Promise<{ shortened: string }> }): Promise<Metadata> {
  const { shortened } = await params;
  const result = await cachedGetThingyByShortened(shortened);
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
  const result = await cachedGetThingyByShortened(shortened);
  if (result.isErr()) return <ErrorPage error={result.error} isForbidden />;
  const thingy = result.value;

  const nextR = await getNext(thingy.next);
  if (nextR.isErr()) return <ErrorPage error={nextR.error} />;
  const next = nextR.value;

  const user = await getUserRole();

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      {next ? (
        <TypographyParagraph className="text-destructive mb-6 font-quotes rounded-md text-lg border-2 border-destructive/80 p-6 w-fit mx-auto">
          NOTE: This thingy is an older version of{" "}
          <TypographyLink variant="primary" href={`/thingies/${next.shortened}`}>
            {next.name}
          </TypographyLink>
          .
        </TypographyParagraph>
      ) : null}
      {thingy.characters ? (
        <TypographySmall>
          <TypographyLink href={`/characters/${thingy.characters.shortened}`}>
            Owned by {thingy.characters.name}
          </TypographyLink>
        </TypographySmall>
      ) : null}
      <div className="flex flex-row flex-wrap justify-between gap-6 items-center">
        <TypographyH1>{thingy.name}</TypographyH1>
        {user.isOk() &&
        (user.value.role === "admin" ||
          user.value.role === "dm" ||
          user.value.auth_user_uuid === thingy.characters?.players.auth_user_uuid) &&
        thingy.character_id &&
        !next ? (
          <div className="flex flex-row gap-2">
            <PutOnAuctionWrapper thingyId={thingy.id} shortened={thingy.shortened} />
            <EditThingy thingy={thingy} characterUuid={thingy.character_id} />
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
      <TypographyParagraph className="max-w-prose not-first:mt-0">{thingy.description}</TypographyParagraph>
    </div>
  );
}

const PutOnAuctionWrapper = async ({ thingyId, shortened }: { thingyId: string; shortened: string }) => {
  const auction = await runQuery((supabase) =>
    supabase
      .from("auction")
      .select("id")
      .or(
        `and(seller_thingy_id.eq.${thingyId},valid.eq.true,next.is.null),and(buyer_thingy_id.eq.${thingyId},valid.eq.true,next.is.null)`,
      ),
  );

  if (auction.isErr()) return;

  if (auction.value.length !== 0) {
    return (
      <Button asChild variant="secondary">
        <Link href={`/auction/${shortened}`}>View Auction</Link>
      </Button>
    );
  }

  return <PutOnAuction thingyId={thingyId} shortened={shortened} />;
};
