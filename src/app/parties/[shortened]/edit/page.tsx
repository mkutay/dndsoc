import { redirect } from "next/navigation";

import { ErrorPage } from "@/components/error-page";
import { getPartyByShortened } from "@/lib/parties";
import { getPlayerUser } from "@/lib/player-user";
import { getUserRole } from "@/lib/roles";
import { getDMUser } from "@/lib/dms";

export default async function Page({ params }: { params: Promise<{ shortened: string }> }) {
  const { shortened } = await params;
  const role = await getUserRole();
  if (role.isErr()) return <ErrorPage error={role.error} caller="/parties/[shortened]" isNotFound />;

  const result = await getPartyByShortened({ shortened });
  if (result.isErr()) return <ErrorPage error={result.error} caller="/parties/[shortened]" isNotFound />;
  const party = result.value;

  if (role.value.role === "player") {
    const player = await getPlayerUser();
    if (player.isErr()) return <ErrorPage error={player.error} caller="/parties/[shortened]" isNotFound />;

    const hasAccess = party.character_party.some((characterParty) => characterParty.characters.player_uuid === player.value.id);
    if (!hasAccess) redirect(`/parties/${shortened}`);
    redirect(`/parties/${shortened}/edit/player`);
  } else {
    const dm = await getDMUser();
    if (dm.isErr()) return <ErrorPage error={dm.error} caller="/parties/[shortened]" isNotFound />;

    const hasAccess = party.dm_party.some((dmParty) => dmParty.dms.id === dm.value.id);
    if (!hasAccess) redirect(`/parties/${shortened}`);
    redirect(`/parties/${shortened}/edit/dm`);
  }
}