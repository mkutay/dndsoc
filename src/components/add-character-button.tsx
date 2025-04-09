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
import { getUser } from "@/lib/auth/user";
import { AddCharacterForm } from "@/app/players/[username]/add-character-form";

export async function AddCharacterButton() {
  const user = await getUser();
  if (user.isErr() || !user.value) return null;

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