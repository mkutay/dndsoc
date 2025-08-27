"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { TypographyLink } from "@/components/typography/paragraph";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Tables } from "@/types/database.types";
import { useToast } from "@/hooks/use-toast";
import { removeDeniedRequest } from "@/server/achievements";
import { actionResultToResult } from "@/types/error-typing";

type Achievement = Tables<"achievements"> & {
  requested: (
    | Tables<"achievement_requests_character">
    | Tables<"achievement_requests_dm">
    | Tables<"achievement_requests_player">
  )[];
};

export function RequestDenied({ achievement }: { achievement: Achievement }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="cursor-pointer w-fit flex flex-row items-center gap-4 px-6 py-4 text-destructive-foreground bg-destructive rounded-2xl shadow-md hover:bg-destructive/80 transition-all">
          <div className="font-quotes text-lg">{achievement.name}</div>
          <div className="w-3.5 h-3.5 bg-linear-to-br from-white/30 to-gray-400 rounded-full shadow-inner border border-white/20"></div>
          <div className="font-quotes text-sm pt-[3px]">(Request Denied)</div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Request denied for{" "}
            <TypographyLink href={`/achievements/${achievement.shortened}`}>{achievement.name}</TypographyLink>
          </DialogTitle>
          <DialogDescription>{achievement.description_long}</DialogDescription>
        </DialogHeader>
        <p>
          Your request for the achievement{" "}
          <TypographyLink href={`/achievements/${achievement.shortened}`}>{achievement.name}</TypographyLink> has been
          denied. You can view the details of your request and try again if you believe this was a mistake, or remove
          the request altogether.
        </p>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary" disabled={isPending}>
              Close
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={() => {
              startTransition(async () => {
                const req = achievement.requested[0];
                const path = `/achievements/${achievement.shortened}`;
                const result = actionResultToResult(
                  "character_id" in req
                    ? await removeDeniedRequest(achievement.id, req.character_id, "character", path)
                    : "dm_id" in req
                      ? await removeDeniedRequest(achievement.id, req.dm_id, "dm", path)
                      : await removeDeniedRequest(achievement.id, req.player_id, "player", path),
                );
                result.match(
                  () => toast({ title: "Request removed successfully!" }),
                  (error) =>
                    toast({ title: "Failed to remove request", description: error.message, variant: "destructive" }),
                );
              });
            }}
          >
            Remove Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
