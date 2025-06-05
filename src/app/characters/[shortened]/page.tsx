import { Dot } from "lucide-react";

import { TypographyLarge, TypographyLead, TypographyLink, TypographySmall } from "@/components/typography/paragraph";
import { TypographyH2 } from "@/components/typography/headings";
import { CharacterEditButton } from "@/components/character-edit-button";
import { formatClasses, formatRaces } from "@/utils/formatting";
import { ErrorPage } from "@/components/error-page";
import DB from "@/lib/db";
import { ErrorComponent } from "@/components/error-component";
import { CampaignCards } from "@/components/campaigns-cards";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ shortened: string }> }) {
  const { shortened } = await params;
  const result = await DB.Characters.Get.With.Player.Shortened({ shortened });
  if (result.isErr()) return { title: "Character Not Found", description: "This character does not exist." };
  const character = result.value;

  const level = character.level;
  const classes = character.classes;
  const races = character.races;
  const name = character.name;
  const description = `Some statistics about character ${name}: Level ${level} · ${formatClasses(classes)} · ${formatRaces(races)}`;
  const title = `Character ${name}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

export default async function Page({ params }: 
  { params: Promise<{ shortened: string }> }
) {
  const { shortened } = await params;
  const result = await DB.Characters.Get.With.Player.Shortened({ shortened });
  if (result.isErr()) return <ErrorPage error={result.error} caller="/characters/[shortened]/page.tsx" isNotFound />;
  const character = result.value;

  const combinedAuth = await DB.Auth.Get.With.PlayerAndRole();
  if (combinedAuth.isErr() && combinedAuth.error.code !== "NOT_LOGGED_IN") return <ErrorPage error={combinedAuth.error} caller="/characters/[shortened]/page.tsx" />;

  const auth = combinedAuth.isOk() ? combinedAuth.value : null;
  const role = auth ? auth.roles?.role : null;
  const ownsCharacter = (character.player_uuid === auth?.players.id) || role === "admin";

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      <div className="flex lg:flex-row flex-col gap-6">
        <div className="lg:w-36 lg:h-36 w-48 h-48 lg:mx-0 mx-auto bg-primary rounded-full"></div>
        <div className="flex flex-col max-w-prose gap-1.5 mt-3">
          <div className="flex flex-col gap-1">
            {character.players && <TypographySmall className="text-muted-foreground">
              Played By <TypographyLink href={`/players/${character.players.users.username}`} variant="muted">
                {character.players.users.name}
              </TypographyLink>
            </TypographySmall>}
            <h1 className="text-primary text-5xl font-extrabold font-headings tracking-wide flex flex-row items-start">
              <div className="font-drop-caps text-7xl">{character.name.charAt(0)}</div>
              <div>{character.name.slice(1)}</div>
            </h1>
          </div>
          <div className="flex flex-row">
            <TypographyLarge>Level {character.level}</TypographyLarge>
            {(character.classes.length !== 0 || character.races.length !== 0) && <Dot className="mt-[1px]" />}
            {character.classes.length !== 0 && <TypographyLarge>{formatClasses(character.classes)}</TypographyLarge>}
            {(character.classes.length !== 0 && character.races.length !== 0) && <Dot className="mt-[1px]" />}
            {character.races.length !== 0 && <TypographyLarge>{formatRaces(character.races)}</TypographyLarge>}
          </div>
          {character.about && character.about.length !== 0 && <TypographyLead className="indent-6">{character.about}</TypographyLead>}
          {ownsCharacter && <CharacterEditButton shortened={shortened} />}
        </div>
      </div>

      <Campaigns characterUuid={character.id} />
      {/* Add achievements */}
    </div>
  );
}

async function Campaigns({ characterUuid }: { characterUuid: string }) {
  const notFound = <TypographyH2 className="mt-6">No campaigns found</TypographyH2>;

  const campaigns = await DB.Campaigns.Get.Character({ characterUuid });
  if (campaigns.isErr()) {
    return campaigns.error.code === "NOT_FOUND"
      ? notFound
      : <ErrorComponent error={campaigns.error} caller="/characters/[username]/campaigns.tsx" />;
  }
  if (campaigns.value.length === 0) {
    return notFound;
  }

  return (
    <>
      <TypographyH2 className="mt-6">Campaigns</TypographyH2>
      <CampaignCards campaigns={campaigns.value} link="/campaigns" />
    </>
  );
}