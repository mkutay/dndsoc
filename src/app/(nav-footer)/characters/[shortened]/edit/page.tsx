import { redirect } from "next/navigation";
import { cache } from "react";

import { CharacterEditForm } from "./form";
import { TypographyH1 } from "@/components/typography/headings";
import { TypographyLink } from "@/components/typography/paragraph";
import { formatClasses, formatRaces } from "@/utils/formatting";
import { ErrorPage } from "@/components/error-page";
import { getCharacterPlayerByShortened } from "@/lib/characters";
import { getPlayerRoleUser } from "@/lib/players";

export const dynamic = "force-dynamic";

const cachedGetCharacter = cache(getCharacterPlayerByShortened);

export async function generateMetadata({ params }: { params: Promise<{ shortened: string }> }) {
  const { shortened } = await params;
  const result = await cachedGetCharacter({ shortened });
  if (result.isErr()) return { title: "Character Not Found", description: "This character does not exist." };
  const character = result.value;

  const level = character.level;
  const classes = character.classes;
  const races = character.races;
  const name = character.name;
  const description = `Some statistics about character ${name}: Level ${level} · ${formatClasses(classes)} · ${formatRaces(races)}`;
  const title = `Edit Character ${name}`;

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
  const result = await cachedGetCharacter({ shortened });

  if (result.isErr())
    return <ErrorPage error={result.error} caller="/characters/[shortened]/edit/page.tsx" isNotFound />;
  const character = result.value;

  const combinedAuth = await getPlayerRoleUser();
  if (combinedAuth.isErr() && combinedAuth.error.code !== "NOT_LOGGED_IN")
    return <ErrorPage error={combinedAuth.error} caller="/characters/[shortened]/edit/page.tsx" />;

  const auth = combinedAuth.isOk() ? combinedAuth.value : null;
  const role = auth ? auth.roles?.role : null;
  const ownsCharacter = character.player_uuid === auth?.players.id || role === "admin";

  if (!ownsCharacter) redirect(`/characters/${shortened}`);

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      <TypographyLink href={`/characters/${shortened}`} className="tracking-wide font-quotes">
        Go Back
      </TypographyLink>
      <TypographyH1 className="mt-0.5">
        Edit <span className="text-primary">{character.name}</span>&apos;s Page
      </TypographyH1>
      <CharacterEditForm character={character} />
    </div>
  );
}
