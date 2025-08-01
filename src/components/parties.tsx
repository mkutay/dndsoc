"use client";

import { useOptimistic, useTransition } from "react";

import { AddParty } from "./add-party";
import { CreateParty } from "./create-party";
import { PartyCard } from "./party-card";
import { addPartyToDM, removePartyFromDM } from "@/server/dms";
import { type Tables } from "@/types/database.types";
import { useToast } from "@/hooks/use-toast";

type Party = Tables<"parties">;

type PartyAction = { type: "add"; party: Party } | { type: "remove"; partyId: string };

type Props =
  | {
      role: "player" | "otherDM";
      parties: Party[];
    }
  | {
      role: "dm";
      parties: Party[];
      DMUuid: string;
    }
  | {
      role: "admin";
      parties: Party[];
      DMUuid: string;
      allParties: Party[];
      revalidate: string;
      mine: boolean;
    };

export function Parties(props: Props) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [optimisticParties, updateOptimisticParties] = useOptimistic(props.parties, (state, action: PartyAction) => {
    switch (action.type) {
      case "add":
        return [...state, action.party];
      case "remove":
        return state.filter((p) => p.id !== action.partyId);
    }
  });

  // Sort parties by name
  const sortedParties = [...optimisticParties].sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });

  const handleRemoveParty = async (party: Party) => {
    if (props.role !== "admin") return;

    startTransition(async () => {
      updateOptimisticParties({ type: "remove", partyId: party.id });

      const result = await removePartyFromDM({
        partyId: party.id,
        dmUuid: props.DMUuid,
        revalidate: props.revalidate,
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
    if (props.role !== "admin") return;

    startTransition(async () => {
      updateOptimisticParties({ type: "add", party });

      const result = await addPartyToDM({
        dmUuid: props.DMUuid,
        partyId: party.id,
        revalidate: props.revalidate,
      });

      if (!result.ok) {
        toast({
          title: "Add Party Failed",
          description: result.error.message,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 mt-6">
      {sortedParties.map((party) =>
        props.role === "admin" ? (
          <PartyCard
            key={party.id}
            party={party}
            onRemove={() => handleRemoveParty(party)}
            isLoading={isPending}
            removeText="Don't DM this party anymore."
          />
        ) : (
          <PartyCard key={party.id} party={party} />
        ),
      )}
      {props.role === "dm" || (props.role === "admin" && props.mine) ? <CreateParty /> : null}
      {props.role === "admin" ? (
        <AddParty
          parties={props.allParties.filter((party) => !optimisticParties.some((p) => p.id === party.id))}
          onAdd={handleAddParty}
          isLoading={isPending}
        />
      ) : null}
    </div>
  );
}
