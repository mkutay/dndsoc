"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AddPartyForm } from "./add-party-form";
import { Card } from "@/components/ui/card";
import { Tables } from "@/types/database.types";
import { useState } from "react";

type Party = Tables<"parties">;

export function AddPartyButton({
  DMUuid,
  parties,
  setOptimisticParties,
}: {
  DMUuid: string,
  parties: Party[],
  setOptimisticParties: (action: {
    type: "add";
    party: Party;
  } | {
    type: "remove";
    partyId: string;
  }) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="nothing"
          type="button"
          className="w-full h-full rounded-lg hover:bg-card/80 bg-card min-h-60"
          asChild
        >
          <Card className="text-3xl font-book-card-titles tracking-widest">
            Add Party
          </Card>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Party</DialogTitle>
          <DialogDescription>
            You can be a DM for any of the existing parties.
          </DialogDescription>
        </DialogHeader>
        <AddPartyForm
          DMUuid={DMUuid}
          parties={parties}
          setOptimisticParties={setOptimisticParties}
          setOpen={setOpen}
        />
      </DialogContent>
    </Dialog>
  );
}