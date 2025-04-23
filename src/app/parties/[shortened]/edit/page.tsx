import { redirect } from "next/navigation";

import { ErrorPage } from "@/components/error-page";
import DB from "@/lib/db";

export default async function Page({ params }: { params: Promise<{ shortened: string }> }) {
  const { shortened } = await params;
  const role = await DB.Roles.Get.With.User();
  if (role.isErr()) return <ErrorPage error={role.error} caller="/parties/[shortened]" isNotFound />;

  const result = await DB.Parties.Get.Shortened({ shortened });
  if (result.isErr()) return <ErrorPage error={result.error} caller="/parties/[shortened]" isNotFound />;
  const party = result.value;

  if (role.value.role === "player") {
    const player = await DB.Players.Get.With.User();
    if (player.isErr()) return <ErrorPage error={player.error} caller="/parties/[shortened]" isNotFound />;

    const hasAccess = party.character_party.some((characterParty) => characterParty.characters.player_uuid === player.value.id);
    if (!hasAccess) redirect(`/parties/${shortened}`);
    redirect(`/parties/${shortened}/edit/player`);
  } else if (role.value.role === "dm") {
    const dm = await DB.DMs.Get.With.User();
    if (dm.isErr()) return <ErrorPage error={dm.error} caller="/parties/[shortened]" isNotFound />;

    const hasAccess = party.dm_party.some((dmParty) => dmParty.dms.id === dm.value.id);
    if (!hasAccess) redirect(`/parties/${shortened}`);
    redirect(`/parties/${shortened}/edit/dm`);
  } else {
    redirect(`/parties/${shortened}/edit/dm`);
  }
}