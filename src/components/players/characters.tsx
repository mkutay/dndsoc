import Link from "next/link";

import { AddCharacterButton } from "./add-character-button";
import { TypographyH2 } from "@/components/typography/headings";
import { Button } from "@/components/ui/button";
import { Tables } from "@/types/database.types";

export function Characters({
  characters,
  ownsPlayer,
  playerUuid,
}: {
  characters: Tables<"characters">[];
  ownsPlayer: boolean;
  playerUuid: string;
}) {
  return (
    <div className="flex flex-col mt-6">
      <TypographyH2>Characters</TypographyH2>
      {characters.length === 0 && ownsPlayer ? (
        <div className="w-fit mt-6">
          <AddCharacterButton playerUuid={playerUuid} />
        </div>
      ) : (
        <div className="flex flex-row gap-2 w-full items-center flex-wrap mt-6">
          {characters.map((character) => (
            <Button asChild variant="secondary" className="w-fit" key={character.id}>
              <Link href={`/characters/${character.shortened}`}>{character.name}</Link>
            </Button>
          ))}
          {ownsPlayer ? <AddCharacterButton playerUuid={playerUuid} /> : null}
        </div>
      )}
    </div>
  );
}
