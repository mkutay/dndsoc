import { Character } from "@/types/full-database.types";
import { CharacterCard } from "./character-card";

export function CharacterCards({
  characters,
}: {
  characters: Character[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      {characters.map((character, index) => (
        <CharacterCard key={index} character={character} />
      ))}
    </div>
  )
}