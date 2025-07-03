import { Plus } from "lucide-react";

import { AddCharacterForm } from "./add-character-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function AddCharacterButton({ playerUuid }: { playerUuid: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="mr-1" /> Add Character
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Character</DialogTitle>
          <DialogDescription>You can add a new character to your player.</DialogDescription>
        </DialogHeader>
        <AddCharacterForm playerUuid={playerUuid} />
      </DialogContent>
    </Dialog>
  );
}
