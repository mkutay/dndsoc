import { redirect } from "next/navigation";
import Link from "next/link";

import { getCharactersByPlayerUuid } from "@/lib/characters/query-player-uuid";
import { AddCharacterButton } from "@/components/add-character-button";
import { TypographyH3 } from "@/components/typography/headings";
import { Button } from "@/components/ui/button";
import { getPlayerUser } from "@/lib/player-user";

export async function Characters({ playerUuid }: { playerUuid: string }) {
  const result = await getCharactersByPlayerUuid({ playerUuid });
  if (result.isErr()) redirect(`/error?error=${result.error.message}`);
  const characters = result.value;

  const playerUser = await getPlayerUser();

  return (
    <div className="flex flex-row gap-4 mt-4 items-center">
      <TypographyH3>
        Plays
      </TypographyH3>
      <div className="flex flex-row gap-2 w-fit items-center">
        {characters.map((character) => (
          <Button asChild variant="secondary" className="w-full" key={character.id}>
            <Link href={`/characters/${character.shortened}`}>
              {character.name}
            </Link>
          </Button>
        ))}
        {playerUser.isOk() && playerUser.value.id === playerUuid && <AddCharacterButton />}
      </div>
    </div>
  );
}