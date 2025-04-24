import Link from "next/link";

import { AddCharacterButton } from "@/app/players/[username]/add-character-button";
import { TypographyH3 } from "@/components/typography/headings";
import { Button } from "@/components/ui/button";
import { Tables } from "@/types/database.types";

export function Characters({
  characters,
  ownsPlayer,
  playerUuid,
}: {
  characters: Tables<"characters">[];
  ownsPlayer?: boolean;
  playerUuid: string;
}) {
  if (characters.length === 0) return (
    <div className="w-fit mt-4">
      {ownsPlayer && <AddCharacterButton playerUuid={playerUuid} />}
    </div>
  );

  return (
    <div className="flex flex-col gap-1 mt-4">
      <TypographyH3>
        Plays:
      </TypographyH3>
      <div className="flex flex-row gap-2 w-full items-center flex-wrap">
        {characters.map((character) => (
          <Button asChild variant="secondary" className="w-fit" key={character.id}>
            <Link href={`/characters/${character.shortened}`}>
              {character.name}
            </Link>
          </Button>
        ))}
        {ownsPlayer && <AddCharacterButton playerUuid={playerUuid} />}
      </div>
    </div>
  );
}