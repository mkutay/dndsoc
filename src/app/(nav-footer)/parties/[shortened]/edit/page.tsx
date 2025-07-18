import { forbidden, redirect } from "next/navigation";
import { cache } from "react";

import { ErrorPage } from "@/components/error-page";
import { getPartyByShortened } from "@/lib/parties";
import { getPlayerRoleUser } from "@/lib/players";

const cachedGetParty = cache(getPartyByShortened);

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
  if (result.isErr()) return <ErrorPage error={result.error} caller="/parties/[shortened]/edit/page.tsx" isNotFound />;
  const party = result.value;

  const dmedBy = party.dm_party.map((dmParty) => dmParty.dms);
  const characters = party.character_party.map((characterParty) => characterParty.characters);

  const combinedAuth = await getPlayerRoleUser();
  if (combinedAuth.isErr() && combinedAuth.error.code !== "NOT_LOGGED_IN")
    return <ErrorPage error={combinedAuth.error} caller="/parties/[shortened]/edit/page.tsx" />;

  const auth = combinedAuth.isOk() ? combinedAuth.value : null;
  const role = auth ? auth.roles?.role : null;
  const ownsAs =
    dmedBy.some((dm) => dm.auth_user_uuid === auth?.auth_user_uuid) || role === "admin"
      ? "dm"
      : characters.some((character) => character.player_uuid === auth?.players.id)
        ? "player"
        : null;

  if (ownsAs === "dm") {
    redirect(`/parties/${shortened}/edit/dm`);
  } else if (ownsAs === "player") {
    redirect(`/parties/${shortened}/edit/player`);
  }

  forbidden();
}
