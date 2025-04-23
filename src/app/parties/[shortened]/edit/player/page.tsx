import { redirect } from "next/navigation";

import { TypographyH1 } from "@/components/typography/headings";
import { TypographyLink } from "@/components/typography/paragraph";
import { ErrorPage } from "@/components/error-page";
import { PlayerForm } from "./form";
import DB from "@/lib/db";

export default async function Page({ params }: { params: Promise<{ shortened: string }> }) {
  const { shortened } = await params;
  const role = await DB.Roles.Get.With.User();
  if (role.isErr()) return <ErrorPage error={role.error} caller="/parties/[shortened]" isNotFound />;

  const result = await DB.Parties.Get.Shortened({ shortened });
  if (result.isErr()) return <ErrorPage error={result.error} caller="/parties/[shortened]" isNotFound />;
  const party = result.value;

  if (role.value.role !== "player") redirect(`/parties/${shortened}/edit/dm`);

  const player = await DB.Players.Get.With.User();
  if (player.isErr()) return <ErrorPage error={player.error} caller="/parties/[shortened]" isNotFound />;

  const hasAccess = party.character_party.some((characterParty) => characterParty.characters.player_uuid === player.value.id);
  if (!hasAccess) redirect(`/parties/${shortened}`);

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose my-12 px-4">
      <TypographyLink href={`/parties/${party.shortened}`} variant="muted">
        Go back
      </TypographyLink>
      <TypographyH1>Edit Your Party</TypographyH1>
      <PlayerForm about={party.about} partyUuid={party.id} />
    </div>
  )
}