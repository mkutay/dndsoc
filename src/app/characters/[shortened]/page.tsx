import { Dot } from "lucide-react";

import { TypographyLarge, TypographyLead, TypographyLink, TypographySmall } from "@/components/typography/paragraph";
import { TypographyH1 } from "@/components/typography/headings";
import { CharacterEditButton } from "@/components/character-edit-button";
import { formatClasses, formatRaces } from "@/utils/formatting";
import { ErrorPage } from "@/components/error-page";
import { Campaigns } from "./campaigns";
import DB from "@/lib/db";

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
      <div className="flex flex-col gap-1">
        {character.players && <TypographySmall className="text-muted-foreground">
          Played By <TypographyLink href={`/players/${character.players.users.username}`} variant="muted">
            {character.players.users.name}
          </TypographyLink>
        </TypographySmall>}
        <div className="flex flex-row justify-between items-center w-full">
          <h1 className="text-primary text-5xl font-extrabold font-headings tracking-wide flex flex-row items-start">
            <div className="font-drop-caps text-7xl">{character.name.charAt(0)}</div>
            <div>{character.name.slice(1)}</div>
          </h1>
          {ownsCharacter && <CharacterEditButton shortened={shortened} />}
        </div>
      </div>
      <div className="flex flex-row">
        <TypographyLarge>Level {character.level}</TypographyLarge>
        {(character.classes.length !== 0 || character.races.length !== 0) && <Dot className="mt-[1px]" />}
        {character.classes.length !== 0 && <TypographyLarge>{formatClasses(character.classes)}</TypographyLarge>}
        {(character.classes.length !== 0 && character.races.length !== 0) && <Dot className="mt-[1px]" />}
        {character.races.length !== 0 && <TypographyLarge>{formatRaces(character.races)}</TypographyLarge>}
      </div>

      {character.about && character.about.length !== 0 && <TypographyLead>{character.about}</TypographyLead>}
      <Campaigns characterUuid={character.id} />
      {/* Add achievements */}
    </div>
  );
}

export async function generateStaticParams() {
  const characters = await DB.Characters.Get.All();
  if (characters.isErr()) return [];
  return characters.value.map((character) => ({
    shortened: character.shortened,
  }));
}