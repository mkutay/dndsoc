import Link from "next/link";

import { TypographyH3 } from "@/components/typography/headings";
import { Button } from "@/components/ui/button";
import { AddPartyButton } from "./add-party-button";

export function Parties({
  DMUuid,
  parties,
  ownsDM,
}: {
  DMUuid: string;
  parties: {
    about: string;
    id: string;
    level: number;
    name: string;
    shortened: string;
  }[];
  ownsDM: boolean;
}) {
  if (parties.length === 0) return <div className="mt-4">
    {ownsDM && <AddPartyButton DMUuid={DMUuid} />}
  </div>;

  return (
    <div className="flex flex-col gap-1 mt-4">
      <TypographyH3>
        Parties:
      </TypographyH3>
      <div className="flex flex-row gap-2 w-full items-center flex-wrap">
        {parties.map((party, index) => (
          <Button asChild variant="secondary" className="w-fit" key={index}>
            <Link href={`/parties/${party.shortened}`}>
              {party.name}
            </Link>
          </Button>
        ))}
        {ownsDM && <AddPartyButton DMUuid={DMUuid} />}
      </div>
    </div>
  );
}