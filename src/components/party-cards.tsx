import { PartyCard } from "./party-card";
import { TypographyParagraph } from "./typography/paragraph";
import { type Tables } from "@/types/database.types";

export function PartyCards({ parties }: { parties: Tables<"parties">[] }) {
  if (parties.length === 0) {
    return <TypographyParagraph>No parties found.</TypographyParagraph>;
  }

  // sort by level
  const sortedParties = [...parties].sort((a, b) => {
    return b.level - a.level;
  });

  return (
    <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 mt-6">
      {sortedParties.map((party) => (
        <PartyCard key={party.id} party={party} />
      ))}
    </div>
  );
}
