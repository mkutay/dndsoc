import { CharacterCard } from "./character-card";
import { type Character } from "@/types/full-database.types";

export function CharacterCards({ characters }: { characters: Character[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      {characters.map((character) => (
        <CharacterCard key={character.id} character={character} />
      ))}
    </div>
  );
}
