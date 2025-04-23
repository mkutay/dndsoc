import { ErrorPage } from "@/components/error-page";
import { TypographyH1 } from "@/components/typography/headings";
import { TypographyLarge, TypographyLead, TypographyLink } from "@/components/typography/paragraph";
import { Campaigns } from "./campaigns";
import { Characters } from "./characters";
import { PartyEditButton } from "./party-edit-button";
import DB from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ shortened: string }> }) {
  const { shortened } = await params;
  const result = await DB.Parties.Get.Shortened({ shortened });
  if (result.isErr()) return <ErrorPage error={result.error} caller="/parties/[shortened]" isNotFound />;
  const party = result.value;

  const dmedBy = party.dm_party.map((dmParty) => dmParty.dms);
  const campaigns = party.party_campaigns.map((partyCampaign) => partyCampaign.campaigns);
  const characters = party.character_party.map((characterParty) => characterParty.characters);

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose my-12 px-4">
      <TypographyLarge className="text-muted-foreground">
        DM&apos;ed by {dmedBy.map((dm, index) => (
          <TypographyLink key={index} href={`/dms/${dm.users.username}`} variant="muted">
            {dm.users.username}{index + 1 < dmedBy.length ? ", " : ""}
          </TypographyLink>
        ))}
      </TypographyLarge>
      <div className="flex flex-row justify-between items-center">
        <TypographyH1 className="text-primary">{party.name}</TypographyH1>
        <PartyEditButton DMUuids={dmedBy.map((dm) => dm.id)} shortened={shortened} />
      </div>
      <TypographyLarge>Level: {party.level}</TypographyLarge>
      {party.about && party.about.length !== 0 && <TypographyLead>{party.about}</TypographyLead>}
      <Campaigns campaigns={campaigns} />
      <Characters characters={characters} />
      {/* <PlayerAchievements receivedAchievements={player.received_achievements_player} /> */}
    </div>
  );
}

export async function generateStaticParams() {
  const parties = await DB.Parties.Get.All();
  if (parties.isErr()) return [];
  return parties.value.map((party) => ({
    shortened: party.shortened,
  }));
}