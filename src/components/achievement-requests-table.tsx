"use client";

import { Check, X, Calendar, Trash } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Tables } from "@/types/database.types";
import { TypographyLink, TypographyParagraph } from "@/components/typography/paragraph";
import { useToast } from "@/hooks/use-toast";
import { actionResultToResult } from "@/types/error-typing";
import { approveAchievementRequest, rejectAchievementRequest, removeRequest } from "@/server/achievements";

export function AchievementRequestsTable({
  dmRequests,
  characterRequests,
  playerRequests,
  path,
}: {
  dmRequests?: (Tables<"achievement_requests_dm"> & {
    achievements: Tables<"achievements">;
    dms: Tables<"dms">;
    users: Tables<"users"> | null;
  })[];
  characterRequests: (Tables<"achievement_requests_character"> & {
    achievements: Tables<"achievements">;
    characters: Tables<"characters">;
    dms:
      | (Tables<"dms"> & {
          users: Tables<"users">;
        })
      | null;
  })[];
  playerRequests: (Tables<"achievement_requests_player"> & {
    achievements: Tables<"achievements">;
    players: Tables<"players">;
    dms:
      | (Tables<"dms"> & {
          users: Tables<"users">;
        })
      | null;
  })[];
  path: string;
}) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleApprove = async (characterId: string, achievementId: string, receiver: "player" | "character" | "dm") => {
    setLoading(true);
    const result = actionResultToResult(await approveAchievementRequest(achievementId, characterId, receiver, path));
    setLoading(false);

    result.match(
      () =>
        toast({
          title: "Request approved successfully",
          description: `The achievement has been granted to the ${receiver}.`,
        }),
      (error) =>
        toast({
          title: "Error approving request",
          description: error.message,
          variant: "destructive",
        }),
    );
  };

  const handleReject = async (characterId: string, achievementId: string, receiver: "player" | "character" | "dm") => {
    setLoading(true);
    const result = actionResultToResult(await rejectAchievementRequest(achievementId, characterId, receiver, path));
    setLoading(false);

    result.match(
      () =>
        toast({
          title: "Request denied",
        }),
      (error) =>
        toast({
          title: "Error denying request",
          description: error.message,
          variant: "destructive",
        }),
    );
  };

  const handleRemoveRequest = async (
    characterId: string,
    achievementId: string,
    receiver: "player" | "character" | "dm",
  ) => {
    setLoading(true);
    const result = actionResultToResult(await removeRequest(achievementId, characterId, receiver, path));
    setLoading(false);

    result.match(
      () =>
        toast({
          title: "Request removed successfully",
        }),
      (error) =>
        toast({
          title: "Error removing request",
          description: error.message,
          variant: "destructive",
        }),
    );
  };

  if (dmRequests?.length === 0 && characterRequests.length === 0 && playerRequests.length === 0) {
    return (
      <TypographyParagraph className="text-center text-muted-foreground">
        No achievement requests found.
      </TypographyParagraph>
    );
  }

  return (
    <div className="rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Achievement Name</TableHead>
            <TableHead className="text-center">Character Name</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Created</TableHead>
            <TableHead className="text-center">Actions</TableHead>
            <TableHead className="text-center">Decision By</TableHead>
            <TableHead className="text-center">Remove</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {characterRequests.map((request) => (
            <TableRow key={request.achievement_id + request.character_id}>
              <TableCell>
                <div className="text-sm text-center">
                  {request.achievements.name}{" "}
                  <TypographyLink href={`/achievements/${request.achievements.shortened}`} target="_blank">
                    ({request.achievements.shortened})
                  </TypographyLink>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm text-center">
                  {request.characters.name}{" "}
                  <TypographyLink href={`/characters/${request.characters.shortened}`} target="_blank">
                    ({request.characters.shortened})
                  </TypographyLink>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant={
                    request.status === "approved"
                      ? "default"
                      : request.status === "denied"
                        ? "destructive"
                        : "secondary"
                  }
                >
                  {request.status[0].toUpperCase() + request.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex flex-row items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Calendar size={14} />
                  {format(request.created_at, "MMM dd, yyyy HH:mm")}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-row items-center justify-center gap-1">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghostPrimary"
                        size="icon"
                        className="h-8 w-8"
                        disabled={loading || request.status !== "pending"}
                      >
                        <Check size={16} />
                        <span className="sr-only">Approve</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action will approve the request and grant the achievement to the character. Are you sure
                          you want to continue?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleApprove(request.character_id, request.achievement_id, "character")}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghostDestructive"
                        size="icon"
                        className="h-8 w-8"
                        disabled={loading || request.status !== "pending"}
                      >
                        <X size={16} />
                        <span className="sr-only">Reject</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will reject the request.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleReject(request.character_id, request.achievement_id, "character")}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
              <TableCell className="text-center">
                {request.dms ? (
                  <TypographyLink
                    href={`/dms/${request.dms.users.username}`}
                    className="flex items-center justify-center gap-2 text-sm"
                    target="_blank"
                  >
                    {request.dms.users.name}
                  </TypographyLink>
                ) : (
                  <span className="text-muted-foreground text-sm italic">Pending</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghostDestructive"
                        size="icon"
                        className="h-8 w-8"
                        disabled={loading || request.status === "pending"}
                      >
                        <Trash size={16} />
                        <span className="sr-only">Remove Request</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action will remove the request from the system. Are you sure you want to continue?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleRemoveRequest(request.character_id, request.achievement_id, "character")}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
