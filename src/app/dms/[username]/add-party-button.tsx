import { Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ErrorComponent } from "@/components/error-component";
import { getDMUser } from "@/lib/dms";
import { AddPartyForm } from "./add-party-form";

export async function AddPartyButton({ DMUuid }: { DMUuid: string }) {
  const result = await getDMUser();
  if (result.isErr()) return <ErrorComponent error={result.error} caller="/components/add-character-button.tsx" returnNull silent />;
  if (result.value.id !== DMUuid) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="mr-1" /> Create Party
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Party</DialogTitle>
          <DialogDescription>
            You can create a new party to be a DM for!
          </DialogDescription>
        </DialogHeader>
        <AddPartyForm />
      </DialogContent>
    </Dialog>
  );
}