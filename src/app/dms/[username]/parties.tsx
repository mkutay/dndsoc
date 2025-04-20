import Link from "next/link";

import { TypographyH3 } from "@/components/typography/headings";
import { Button } from "@/components/ui/button";
import { ErrorComponent } from "@/components/error-component";
import { getPartyByDMUuid } from "@/lib/party";
import { AddPartyButton } from "./add-party-button";

export async function Parties({ DMUuid }: { DMUuid: string }) {
  const result = await getPartyByDMUuid({ DMUuid });
  if (result.isErr()) return <ErrorComponent error={result.error} caller="/players/[username]/characters.tsx" />;
  const parties = result.value;

  if (parties.length === 0) return null;

  return (
    <div className="flex flex-col gap-1 mt-4">
      <TypographyH3>
        Parties:
      </TypographyH3>
      <div className="flex flex-row gap-2 w-full items-center flex-wrap sm:flex-nowrap">
        {parties.map((party, index) => (
          <Button asChild variant="secondary" className="w-fit" key={index}>
            <Link href={`/parties/${party.shortened}`}>
              {party.name}
            </Link>
          </Button>
        ))}
        <AddPartyButton DMUuid={DMUuid} />
      </div>
    </div>
  );
}