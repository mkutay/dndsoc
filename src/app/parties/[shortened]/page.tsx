import { ErrorPage } from "@/components/error-page";
import { TypographyH1 } from "@/components/typography/headings";
import { TypographyLarge, TypographyLead, TypographyLink, TypographySmall } from "@/components/typography/paragraph";
import { Campaigns } from "./campaigns";
import { Characters } from "./characters";
import { PartyEditButton } from "./party-edit-button";
import DB from "@/lib/db";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ shortened: string }> }) {
  const { shortened } = await params;
  const result = await DB.Parties.Get.Shortened({ shortened });
  if (result.isErr()) return { title: "Party Not Found", description: "This party does not exist." };
  const party = result.value;

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
    },
  };
}

export default async function Page({ params }: { params: Promise<{ shortened: string }> }) {
  const { shortened } = await params;
  const result = await DB.Parties.Get.Shortened({ shortened });
  if (result.isErr()) return <ErrorPage error={result.error} caller="/parties/[shortened]/page.tsx" isNotFound />;
  const party = result.value;

  const dmedBy = party.dm_party.map((dmParty) => dmParty.dms);
  const campaigns = party.party_campaigns.map((partyCampaign) => partyCampaign.campaigns);
  const characters = party.character_party.map((characterParty) => characterParty.characters);

  const combinedAuth = await DB.Auth.Get.With.PlayerAndRole();
  if (combinedAuth.isErr() && combinedAuth.error.code !== "NOT_LOGGED_IN") return <ErrorPage error={combinedAuth.error} caller="/parties/[shortened]/page.tsx" />;

  const auth = combinedAuth.isOk() ? combinedAuth.value : null;
  const role = auth ? auth.roles?.role : null;
  const ownsAs = ((dmedBy.some((dm) => dm.auth_user_uuid === auth?.auth_user_uuid)) || role === "admin")
    ? "dm"
    : ((characters.some((character) => character.player_uuid === auth?.players.id)) ? "player" : null);

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      <TypographySmall className="text-muted-foreground">
        DM&apos;ed By {dmedBy.map((dm, index) => (
          <TypographyLink key={index} href={`/dms/${dm.users.username}`} variant="muted">
            {dm.users.username}{index + 1 < dmedBy.length ? ", " : ""}
          </TypographyLink>
        ))}
      </TypographySmall>
      <div className="flex flex-row justify-between items-center">
        <TypographyH1 className="text-primary">{party.name}</TypographyH1>
        <PartyEditButton ownsAs={ownsAs} shortened={shortened} />
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