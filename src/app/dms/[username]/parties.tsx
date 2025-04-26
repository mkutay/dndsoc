"use client";

import { MinusCircle } from "lucide-react";
import { useOptimistic } from "react";
import Link from "next/link";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { TypographyParagraph } from "@/components/typography/paragraph";
import { TypographyH2 } from "@/components/typography/headings";
import { Tables } from "@/types/database.types";
import Server from "@/server/server";
import { useToast } from "@/hooks/use-toast";
import { CreatePartyButton } from "./create-party-button";
import { AddPartyButton } from "./add-party-button";

type Party = Tables<"parties">;

export function Parties({
  DMUuid,
  parties,
  ownsDM,
  allParties
}: {
  DMUuid: string;
  parties: Party[];
  ownsDM: boolean;
  allParties: Party[] | undefined;
}) {
  const { toast } = useToast();

  const [optimisticParties, setOptimisticParties] = useOptimistic(
    parties,
    (currentState, action: {
      type: "add"; party: Party;
    } | {
      type: "remove"; partyId: string;
    }) => action.type === "add"
      ? [...currentState, action.party]
      : currentState.filter((party) => party.id !== action.partyId),
  );

  // sort by name
  optimisticParties.sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });

  const onSubmit = async (party: Party) => {
    setOptimisticParties({
      type: "remove",
      partyId: party.id,
    });
    const result = await Server.DMs.Remove.Party({ partyId: party.id, dmUuid: DMUuid, revalidate: "/dms/[username]" });
    if (!result.ok) {
      toast({
        title: "Could Not Remove Party",
        description: result.error.message,
        variant: "destructive",
      });
      setOptimisticParties({
        type: "add",
        party,
      });
    }
  };

  return (
    <div className="mt-6 flex flex-col">
      <TypographyH2>Parties</TypographyH2>
      <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 mt-6">
        {optimisticParties.map((party, index) => (
          <Card key={index} className="w-full">
            <CardHeader>
              <CardTitle>{party.name}</CardTitle>
              <CardDescription>
                Level {party.level}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TypographyParagraph>
                {party.about}
              </TypographyParagraph>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href={`/parties/${party.shortened}`}>
                  View {party.name}
                </Link>
              </Button>
                {ownsDM && (
                  <form
                    action={async () => { await onSubmit(party); }}
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="destructive" size="icon" type="submit">
                            <MinusCircle size="18px" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <TypographyParagraph>Don&apos;t DM this party anymore.</TypographyParagraph>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </form>
                )}
            </CardFooter>
          </Card>
        ))}
        {ownsDM && <CreatePartyButton />}
        {ownsDM && allParties && <AddPartyButton
          DMUuid={DMUuid}
          parties={allParties.filter((party) => !optimisticParties.some((p) => p.id === party.id))}
          setOptimisticParties={setOptimisticParties}
        />}
      </div>
    </div>
  );
}