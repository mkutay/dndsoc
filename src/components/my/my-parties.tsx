import { Crown } from "lucide-react";

import { TypographyParagraph } from "@/components/typography/paragraph";
import { type Tables } from "@/types/database.types";
import { Parties } from "@/components/parties";
import { getParties } from "@/lib/parties";
import { ErrorPage } from "@/components/error-page";

export async function MyParties({
  parties,
  dmUuid,
  admin,
}: {
  parties: Tables<"parties">[];
  dmUuid: string;
  admin: boolean;
}) {
  const allParties = await getParties();
  if (allParties.isErr()) return <ErrorPage error={allParties.error} caller="/components/my/my-parties.tsx" />;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Crown size={20} />
        <h3 className="scroll-m-20 sm:text-3xl text-2xl font-semibold tracking-tight font-headings">
          Parties You DM ({parties.length})
        </h3>
      </div>
      {parties.length === 0 && (
        <TypographyParagraph className="text-muted-foreground not-first:mt-2">
          You don&apos;t DM any parties yet. Create your first party to start DMing!
        </TypographyParagraph>
      )}
      <Parties
        ownsDM={true}
        parties={parties}
        allParties={allParties.value}
        DMUuid={dmUuid}
        revalidate="/my"
        admin={admin}
      />
    </div>
  );
}
