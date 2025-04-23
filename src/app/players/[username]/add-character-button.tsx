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
import { AddCharacterForm } from "@/app/players/[username]/add-character-form";
import { ErrorComponent } from "@/components/error-component";
import DB from "@/lib/db";

export async function AddCharacterButton({ playerUuid }: { playerUuid: string }) {
  const playerUser = await DB.Players.Get.With.User();
  if (playerUser.isErr()) return <ErrorComponent error={playerUser.error} caller="/components/add-character-button.tsx" returnNull silent />;
  if (playerUser.value.id !== playerUuid) return null;

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
          <DialogDescription>
            You can add a new character to your player.
          </DialogDescription>
        </DialogHeader>
        <AddCharacterForm />
      </DialogContent>
    </Dialog>
  );
}