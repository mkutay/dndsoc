import { Crown } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TypographyParagraph } from "@/components/typography/paragraph";
import { Tables } from "@/types/database.types";
import { Parties } from "@/components/parties";
import { getParties } from "@/lib/parties";
import { ErrorPage } from "@/components/error-page";

export async function MyParties({
  parties,
  dmUuid,
}: {
  parties: Tables<"parties">[];
  dmUuid: string;
}) {
  const allParties = await getParties();
  if (allParties.isErr()) return <ErrorPage error={allParties.error} caller="/components/my/my-parties.tsx" />;

  if (parties.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown size={20} />
            Parties You DM
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TypographyParagraph className="text-muted-foreground">
            You don&apos;t DM any parties yet. Create your first party to start DMing!
          </TypographyParagraph>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Crown size={20} />
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight font-headings">
          Parties You DM ({parties.length})
        </h3>
      </div>
      <Parties
        ownsDM={true}
        parties={parties}
        allParties={allParties.value}
        DMUuid={dmUuid}
      />
    </div>
  );
}
