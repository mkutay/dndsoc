import { redirect } from "next/navigation";

import { getCharacterByShortened } from "@/lib/characters/query-shortened";
import { getPlayerUser } from "@/lib/player-user";
import { TypographyH1 } from "@/components/typography/headings";
import { CharacterEditForm } from "./form";

export default async function Page(props: 
  { params: Promise<{ shortened: string }> }
) {
  const { shortened } = await props.params;
  const playerUser = await getPlayerUser();
  if (playerUser.isErr()) redirect("/sign-in");

  const characterResult = await getCharacterByShortened({ shortened });
  if (characterResult.isErr()) {
    return redirect("/error?error=" + characterResult.error.message);
  }
  const character = characterResult.value;

  // Check if the character belongs to the player
  if (character.player_uuid !== playerUser.value.id) {
    return redirect(`/characters/${shortened}`);
  }

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose my-6 px-4 gap-6">
      <TypographyH1>Edit <span className="text-primary">{character.name}</span>&apos;s Page</TypographyH1>
      <CharacterEditForm character={character} />
    </div>
  );
}