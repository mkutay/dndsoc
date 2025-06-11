"use client";

import { useOptimistic, useTransition } from "react";

import { TypographyH2 } from "@/components/typography/headings";
import { Tables } from "@/types/database.types";
import { useToast } from "@/hooks/use-toast";
import { AddParty } from "./add-party";
import { CreateParty } from "./create-party";
import { PartyCard } from "../party-card";
import { addPartyToDM, removePartyFromDM } from "@/server/dms";

type Party = Tables<"parties">;

type PartyAction =
  | { type: "add"; party: Party }
  | { type: "remove"; partyId: string };

export function Parties({
  DMUuid,
  parties,
  ownsDM,
  allParties,
}: {
  DMUuid: string;
  parties: Party[];
  ownsDM: boolean;
  allParties: Party[] | undefined;
}) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [optimisticParties, updateOptimisticParties] = useOptimistic(
    parties,
    (state, action: PartyAction) => {
      switch (action.type) {
        case "add":
          return [...state, action.party];
        case "remove":
          return state.filter((p) => p.id !== action.partyId);
      }
    }
  );

  // Sort parties by name
  const sortedParties = [...optimisticParties].sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });

  const handleRemoveParty = async (party: Party) => {
    startTransition(async () => {
      updateOptimisticParties({ type: "remove", partyId: party.id });

      const result = await removePartyFromDM({
        partyId: party.id,
        dmUuid: DMUuid,
        revalidate: "/dms/[username]",
      });

      if (!result.ok) {
        toast({
          title: "Could Not Remove Party",
          description: result.error.message,
          variant: "destructive",
        });
      }
    });
  };

  const handleAddParty = async (party: Party) => {
    startTransition(async () => {
      updateOptimisticParties({ type: "add", party });

      const result = await addPartyToDM({
        dmUuid: DMUuid,
        partyId: party.id,
        revalidate: `/dms/[username]`,
      });

      if (!result.ok) {
        toast({
          title: "Add Party Failed",
          description: result.error.message,
          variant: "destructive",
        })
      }
    });
  };

  const availableParties =
    allParties?.filter(
      (party) => !optimisticParties.some((p) => p.id === party.id)
    ) ?? [];

  return (
    <div className="mt-6 flex flex-col">
      <TypographyH2>Parties</TypographyH2>
      <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 mt-6">
        {sortedParties.map((party) => (
          <PartyCard
            key={party.id}
            party={party}
            ownsDM={ownsDM}
            onRemove={() => handleRemoveParty(party)}
            isLoading={isPending}
            removeText="Don't DM this party anymore."
          />
        ))}
        {ownsDM && <CreateParty />}
        {ownsDM && availableParties.length > 0 && (
          <AddParty
            parties={availableParties}
            onAdd={handleAddParty}
            isLoading={isPending}
          />
        )}
      </div>
    </div>
  );
}