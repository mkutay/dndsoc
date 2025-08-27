import { TiPencil } from "react-icons/ti";
import type { Metadata } from "next";
import Image from "next/image";
import { cache } from "react";

import { errAsync, okAsync } from "neverthrow";
import { Characters } from "./_components/characters";
import { Campaigns } from "./_components/campaigns";
import { EditPartyPlayerSheet } from "./_components/edit-party-player-sheet";
import { EditPartyDMSheet } from "./_components/edit-party-dm-sheet";
import { TypographyLarge, TypographyLead, TypographyLink, TypographySmall } from "@/components/typography/paragraph";
import { ErrorPage } from "@/components/error-page";
import { getWithImage } from "@/lib/storage";
import { getPlayerRoleUser } from "@/lib/players";
import { getCharacters } from "@/lib/characters";
import { getCampaigns } from "@/lib/campaigns";
import { Button } from "@/components/ui/button";
import { runQuery } from "@/utils/supabase-run";

export const dynamic = "force-dynamic";

const getParty = cache(({ shortened }: { shortened: string }) =>
  runQuery((supabase) =>
    supabase
      .from("parties")
      .select(
        `*, dm_party(*, dms!inner(*, users(*))), character_party(*, characters!inner(*, races(*), classes(*), players(*, users(*)))), party_campaigns(*, campaigns!inner(*)), images(*)`,
      )
      .eq("shortened", shortened)
      .single(),
  ).andThen(getWithImage),
);

export async function generateMetadata({ params }: { params: Promise<{ shortened: string }> }): Promise<Metadata> {
  const { shortened } = await params;
  const result = await getParty({ shortened });
  if (result.isErr()) return { title: "Party Not Found", description: "This party does not exist." };
  const { data: party, url } = result.value;

  const level = party.level;
  const about = party.about;
  const char = party.character_party.length;
  const description = `${about}${about && ". "}Level ${level} · Has ${char} Character${char === 1 ? "" : "s"}`;
  const title = `Party ${party.name}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [url ?? "/logo-light.png"],
    },
  };
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ shortened: string }>;
  searchParams: Promise<{ edit: string | null }>;
}) {
  const { shortened } = await params;
  const { edit } = await searchParams;
  const result = await getParty({ shortened })
    .andThen((result) =>
      getPlayerRoleUser()
        .orElse((error) => (error.code === "NOT_LOGGED_IN" ? okAsync(null) : errAsync(error)))
        .map((user) => ({ ...result, user })),
    )
    .map((result) => ({
      ...result,
      dmedBy: result.data.dm_party.map((dmParty) => dmParty.dms),
      campaigns: result.data.party_campaigns.map((partyCampaign) => partyCampaign.campaigns),
      characters: result.data.character_party.map((characterParty) => characterParty.characters),
    }))
    .map((result) => ({
      ...result,
      ownsAs:
        result.user?.roles.role === "admin"
          ? ("admin" as const)
          : result.dmedBy.some((dm) => dm.auth_user_uuid === result.user?.auth_user_uuid)
            ? ("dm" as const)
            : result.characters.some((character) => character.player_uuid === result.user?.players.id)
              ? ("player" as const)
              : null,
    }))
    .andThen((result) =>
      result.ownsAs === "dm" || result.ownsAs === "admin"
        ? getCampaigns().map((allCampaigns) => ({ ...result, allCampaigns }))
        : okAsync({ ...result, allCampaigns: undefined }),
    )
    .andThen((result) =>
      result.ownsAs === "dm" || result.ownsAs === "admin"
        ? getCharacters().map((allCharacters) => ({ ...result, allCharacters }))
        : okAsync({ ...result, allCharacters: undefined }),
    )
    .andThen((result) => {
      const thisDMId = result.dmedBy.find((dm) => dm.auth_user_uuid === result.user?.auth_user_uuid)?.id;
      if (!thisDMId && result.ownsAs === "dm")
        return errAsync({ code: "NOT_FOUND" as const, message: "Could not find your DM ID." });
      return okAsync({ ...result, thisDMId });
    });

  if (result.isErr()) return <ErrorPage error={result.error} caller="/parties/[shortened]/page.tsx" isNotFound />;
  const { data: party, url, dmedBy, campaigns, ownsAs, allCharacters, allCampaigns, characters } = result.value;

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      <div className="flex flex-col gap-6">
        {url ? (
          <Image
            src={url}
            alt={`Image of ${party.name}`}
            width={1600}
            height={1000}
            className="rounded-lg max-w-2xl lg:mx-auto mx-0 w-full"
          />
        ) : null}
        <div className="flex flex-col mt-3 max-w-prose gap-1.5">
          {dmedBy.length !== 0 && (
            <TypographySmall className="text-muted-foreground">
              DM&apos;ed By{" "}
              {dmedBy.map((dm, index) => (
                <TypographyLink key={index} href={`/dms/${dm.users.username}`} variant="muted">
                  {dm.users.name}
                  {index + 1 < dmedBy.length ? ", " : ""}
                </TypographyLink>
              ))}
            </TypographySmall>
          )}
          <h1 className="text-primary font-extrabold text-5xl font-headings tracking-wide flex flex-row items-start">
            <div className="font-drop-caps text-7xl font-medium">{party.name[0]}</div>
            <div>{party.name.slice(1)}</div>
          </h1>
          <TypographyLarge className="-mt-0.5">Level: {party.level}</TypographyLarge>
          {party.about && party.about.length !== 0 ? <TypographyLead>{party.about}</TypographyLead> : null}
          {ownsAs === "player" ? (
            <EditPartyPlayerSheet party={{ about: party.about, id: party.id }} path={`/parties/${shortened}`}>
              <Button variant="outline" size="default" className="w-fit mt-1.5">
                <TiPencil size={24} className="mr-2" /> Edit
              </Button>
            </EditPartyPlayerSheet>
          ) : (ownsAs === "dm" || ownsAs === "admin") && allCharacters ? (
            <EditPartyDMSheet
              path={`/parties/${shortened}`}
              party={{
                about: party.about,
                id: party.id,
                name: party.name,
                level: party.level,
                characters: characters.map((char) => ({
                  id: char.id,
                  name: char.name,
                  shortened: char.shortened,
                  player: char.players
                    ? {
                        id: char.players.id,
                        username: char.players.users.username,
                        name: char.players.users.name,
                      }
                    : null,
                })),
              }}
              characters={allCharacters.map((char) => ({
                id: char.id,
                name: char.name,
                shortened: char.shortened,
                player: char.players
                  ? {
                      id: char.players.id,
                      username: char.players.users.username,
                      name: char.players.users.name,
                    }
                  : null,
              }))}
              edit={edit === "true"}
            >
              <Button variant="outline" size="default" className="w-fit mt-1.5">
                <TiPencil size={24} className="mr-2" /> Edit
              </Button>
            </EditPartyDMSheet>
          ) : null}
        </div>
      </div>
      <Characters characters={characters} ownsAs={ownsAs} partyId={party.id} allCharacters={allCharacters} />
      <Campaigns campaigns={campaigns} ownsAs={ownsAs} partyId={party.id} allCampaigns={allCampaigns} />
    </div>
  );
}
