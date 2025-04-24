import { redirect } from "next/navigation";

import { ErrorPage } from "@/components/error-page";
import DB from "@/lib/db";

export default async function Page({ params }: { params: Promise<{ shortened: string }> }) {
  const { shortened } = await params;
  const result = await DB.Parties.Get.Shortened({ shortened });
  if (result.isErr()) return <ErrorPage error={result.error} caller="/parties/[shortened]" isNotFound />;
  const party = result.value;

  const dmedBy = party.dm_party.map((dmParty) => dmParty.dms);
  const characters = party.character_party.map((characterParty) => characterParty.characters);

  const combinedAuth = await DB.Auth.Get.With.PlayerAndRole();
  if (combinedAuth.isErr() && combinedAuth.error.code !== "NOT_LOGGED_IN") return <ErrorPage error={combinedAuth.error} caller="/players/[username]" />;

  const auth = combinedAuth.isOk() ? combinedAuth.value : null;
  const role = auth ? auth.roles?.role : null;
  const ownsAs = ((dmedBy.some((dm) => dm.auth_user_uuid === auth?.auth_user_uuid)) || role === "admin")
    ? "dm"
    : ((characters.some((character) => character.player_uuid === auth?.players.id)) ? "player" : null);

  if (ownsAs === "dm") {
    redirect(`/parties/${shortened}/edit/dm`);
  } else if (ownsAs === "player") {
    redirect(`/parties/${shortened}/edit/player`);
  }

  return (
    <ErrorPage error={{ code: "NOT_LOGGED_IN", message: "You are not logged in." }} caller="/parties/[shortened]" isForbidden />
  )
}