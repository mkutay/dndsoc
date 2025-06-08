import { PartyCard } from "./party-card";
import { TypographyParagraph } from "./typography/paragraph";
import { Tables } from "@/types/database.types";

export function PartyCards({
  parties,
}: {
  parties: Tables<"parties">[];
}) {
  if (parties.length === 0) {
    return (
      <TypographyParagraph>
        No parties found.
      </TypographyParagraph>
    );
  }

  // sort by level
  parties.sort((a, b) => {
    return b.level - a.level;
  });

  return (
    <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 mt-6">
      {parties.map((party, index) => (
        <PartyCard
          key={index}
          party={party}
        />
      ))}
    </div>
  )
}