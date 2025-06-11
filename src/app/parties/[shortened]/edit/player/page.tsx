import { redirect } from "next/navigation";
import { cache } from "react";

import { TypographyH1 } from "@/components/typography/headings";
import { TypographyLink } from "@/components/typography/paragraph";
import { ErrorPage } from "@/components/error-page";
import { PlayerForm } from "./form";
import DB from "@/lib/db";

const cachedGetParty = cache(DB.Parties.Get.Shortened);

export async function generateMetadata({ params }: { params: Promise<{ shortened: string }> }) {
  const { shortened } = await params;
  const result = await cachedGetParty({ shortened });
  if (result.isErr()) return { title: "Party Not Found", description: "This party does not exist." };
  const party = result.value;

  const level = party.level;
  const about = party.about;
  const char = party.character_party.length;
  const description = `${about}${about && ". "}Level ${level} · Has ${char} Character${char === 1 ? "" : "s"}`;
  const title = `Edit Party ${party.name}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

export default async function Page({ params }: { params: Promise<{ shortened: string }> }) {
  const { shortened } = await params;
  const result = await cachedGetParty({ shortened });
  if (result.isErr()) return <ErrorPage error={result.error} caller="/parties/[shortened]/edit/player/page.tsx" isNotFound />;
  const party = result.value;

  const dmedBy = party.dm_party.map((dmParty) => dmParty.dms);
  const characters = party.character_party.map((characterParty) => characterParty.characters);

  const combinedAuth = await DB.Auth.Get.With.PlayerAndRole();
  if (combinedAuth.isErr() && combinedAuth.error.code !== "NOT_LOGGED_IN") return <ErrorPage error={combinedAuth.error} caller="/parties/[shortened]/edit/player/page.tsx" />;

  const auth = combinedAuth.isOk() ? combinedAuth.value : null;
  const role = auth ? auth.roles?.role : null;
  const ownsAs = ((dmedBy.some((dm) => dm.auth_user_uuid === auth?.auth_user_uuid)) || role === "admin")
    ? "dm"
    : ((characters.some((character) => character.player_uuid === auth?.players.id)) ? "player" : null);

  if (ownsAs === "dm") {
    redirect(`/parties/${shortened}/edit/dm`);
  } else if (ownsAs === null) {
    redirect(`/parties/${shortened}`);
  }

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      <TypographyLink href={`/parties/${party.shortened}`} variant="muted" className="tracking-wide font-quotes">
        Go Back
      </TypographyLink>
      <TypographyH1>Edit Your Party</TypographyH1>
      <PlayerForm about={party.about} partyUuid={party.id} />
    </div>
  )
}