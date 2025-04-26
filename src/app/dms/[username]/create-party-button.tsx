import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreatePartyForm } from "./create-party-form";
import { Card } from "@/components/ui/card";

export function CreatePartyButton({ DMUuid }: { DMUuid: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="nothing"
          type="button"
          className="w-full h-full rounded-lg hover:bg-card/80 bg-card min-h-60"
          asChild
        >
          <Card className="text-3xl font-book-card-titles tracking-widest">
            Create a New Party
          </Card>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Party</DialogTitle>
          <DialogDescription>
            You can create a new party to be a DM for!
          </DialogDescription>
        </DialogHeader>
        <CreatePartyForm />
      </DialogContent>
    </Dialog>
  );
}