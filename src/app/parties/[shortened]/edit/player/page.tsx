import { redirect } from "next/navigation";

import { TypographyH1 } from "@/components/typography/headings";
import { ErrorPage } from "@/components/error-page";
import { getPartyByShortened } from "@/lib/parties";
import { getUserRole } from "@/lib/roles";
import { PlayerForm } from "./form";
import { getPlayerUser } from "@/lib/player-user";

export default async function Page({ params }: { params: Promise<{ shortened: string }> }) {
  const { shortened } = await params;
  const role = await getUserRole();
  if (role.isErr()) return <ErrorPage error={role.error} caller="/parties/[shortened]" isNotFound />;

  const result = await getPartyByShortened({ shortened });
  if (result.isErr()) return <ErrorPage error={result.error} caller="/parties/[shortened]" isNotFound />;
  const party = result.value;

  if (role.value.role !== "player") redirect(`/parties/${shortened}/edit/dm`);

  const player = await getPlayerUser();
  if (player.isErr()) return <ErrorPage error={player.error} caller="/parties/[shortened]" isNotFound />;

  const hasAccess = party.character_party.some((characterParty) => characterParty.characters.player_uuid === player.value.id);
  if (!hasAccess) redirect(`/parties/${shortened}`);

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose my-12 px-4">
      <TypographyH1>Edit Your Party</TypographyH1>
      <PlayerForm about={party.about} partyUuid={party.id} />
    </div>
  )
}