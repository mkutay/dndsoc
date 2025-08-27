import { Suspense } from "react";

import { TypographyParagraph } from "@/components/typography/paragraph";
import { type Tables } from "@/types/database.types";
import { Parties } from "@/components/parties";
import { getParties } from "@/lib/parties";

export function MyParties({
  parties,
  dmUuid,
  role,
}: {
  parties: Tables<"parties">[];
  dmUuid: string;
  role: "dm" | "admin";
}) {
  return (
    <div className="space-y-4">
      {parties.length === 0 && (
        <TypographyParagraph className="text-muted-foreground not-first:mt-2">
          You don&apos;t DM any parties yet. Create your first party to start DMing!
        </TypographyParagraph>
      )}
      {role === "dm" ? (
        <Parties role="dm" parties={parties} DMUuid={dmUuid} />
      ) : role === "admin" ? (
        <Suspense>
          <Admin parties={parties} dmUuid={dmUuid} />
        </Suspense>
      ) : null}
    </div>
  );
}

async function Admin({ parties, dmUuid }: { parties: Tables<"parties">[]; dmUuid: string }) {
  const allParties = await getParties();
  if (allParties.isErr()) return <Parties role="dm" parties={parties} DMUuid={dmUuid} />;

  return <Parties role="admin" parties={parties} allParties={allParties.value} DMUuid={dmUuid} revalidate="/my" mine />;
}
