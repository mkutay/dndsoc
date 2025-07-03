"use client";

import { useState } from "react";
import { AddPartyForm } from "./add-party-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tables } from "@/types/database.types";

type Party = Tables<"parties">;

export function AddPartyButton({
  campaignUuid,
  parties,
  setOptimisticParties,
  shortened,
}: {
  campaignUuid: string;
  parties: Party[];
  setOptimisticParties: (
    action:
      | {
          type: "add";
          party: Party;
        }
      | {
          type: "remove";
          partyId: string;
        },
  ) => void;
  shortened: string;
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
          <Card className="text-3xl font-book-card-titles tracking-widest">Add Party</Card>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Party</DialogTitle>
          <DialogDescription>You can add any existing party to this campaign.</DialogDescription>
        </DialogHeader>
        <AddPartyForm
          campaignUuid={campaignUuid}
          parties={parties}
          setOptimisticParties={setOptimisticParties}
          setOpen={setOpen}
          shortened={shortened}
        />
      </DialogContent>
    </Dialog>
  );
}
