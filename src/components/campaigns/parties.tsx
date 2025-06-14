"use client";

import { useOptimistic } from "react";

import { TypographyH2 } from "@/components/typography/headings";
import { Tables } from "@/types/database.types";
import { useToast } from "@/hooks/use-toast";
import { AddPartyButton } from "./add-party-button";
import { CreatePartyButton } from "./create-party-button";
import { removeCampaignFromParty } from "@/server/campaigns";
import { PartyCard } from "../party-card";

type Party = Tables<"parties">;

export function Parties({
  campaignUuid,
  parties,
  isAdmin,
  allParties,
  shortened,
}: {
  campaignUuid: string;
  parties: Party[];
  isAdmin: boolean;
  allParties: Party[] | undefined;
  shortened: string;
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
    const result = await removeCampaignFromParty({ partyId: party.id, campaignId: campaignUuid, shortened });
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
        {optimisticParties.map((party) => (
          <PartyCard
            key={party.id}
            party={party}
            ownsDM={isAdmin}
            onRemove={() => onSubmit(party)}
            isLoading={false}
            removeText="Remove this party from the campaign."
          />
        ))}
        {isAdmin && <CreatePartyButton campaignUuid={campaignUuid} />}
        {isAdmin && <AddPartyButtonWrapper
          campaignUuid={campaignUuid}
          allParties={allParties}
          setOptimisticParties={setOptimisticParties}
          optimisticParties={optimisticParties}
          shortened={shortened}
        />}
      </div>
    </div>
  );
}

function AddPartyButtonWrapper({
  campaignUuid,
  allParties,
  setOptimisticParties,
  optimisticParties,
  shortened,
}: {
  campaignUuid: string;
  allParties: Party[] | undefined;
  setOptimisticParties: (action: {
    type: "add"; party: Party;
  } | {
    type: "remove"; partyId: string;
  }) => void;
  optimisticParties: Party[];
  shortened: string;
}) {
  if (!allParties || allParties.length === 0) return null;
  const parties = allParties.filter((party) => !optimisticParties.some((p) => p.id === party.id));
  if (parties.length === 0) return null;
  return (
    <AddPartyButton
      shortened={shortened}
      campaignUuid={campaignUuid}
      parties={parties}
      setOptimisticParties={setOptimisticParties}
    />
  )
}