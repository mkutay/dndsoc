import Link from "next/link";

import { getCharactersByPlayerUuid } from "@/lib/characters";
import { AddCharacterButton } from "@/app/players/[username]/add-character-button";
import { TypographyH3 } from "@/components/typography/headings";
import { Button } from "@/components/ui/button";
import { ErrorComponent } from "@/components/error-component";

export async function Characters({ playerUuid }: { playerUuid: string }) {
  const result = await getCharactersByPlayerUuid({ playerUuid });
  if (result.isErr()) return <ErrorComponent error={result.error} caller="/players/[username]/characters.tsx" />;
  const characters = result.value;

  if (characters.length === 0) return null;

  return (
    <div className="flex flex-col gap-1 mt-4">
      <TypographyH3>
        Plays:
      </TypographyH3>
      <div className="flex flex-row gap-2 w-full items-center flex-wrap sm:flex-nowrap">
        {characters.map((character) => (
          <Button asChild variant="secondary" className="w-fit" key={character.id}>
            <Link href={`/characters/${character.shortened}`}>
              {character.name}
            </Link>
          </Button>
        ))}
        <AddCharacterButton playerUuid={playerUuid} />
      </div>
    </div>
  );
}