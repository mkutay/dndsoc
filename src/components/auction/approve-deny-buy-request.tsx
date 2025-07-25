"use client";

import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { TypographyParagraph } from "@/components/typography/paragraph";
import { approveBuyRequest, rejectBuyRequest } from "@/server/auction";
import { actionResultToResult } from "@/types/error-typing";
import { useToast } from "@/hooks/use-toast";

export function ApproveDenyBuyRequest({ auctionId }: { auctionId: string }) {
  const { toast } = useToast();
  return (
    <div className="mt-6 flex gap-2">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="default">Accept Trade</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          </AlertDialogHeader>
          <TypographyParagraph>
            This will approve the trade and mark the auction as signed off. The buyer will receive the thingy they
            requested, and you will receive the thingy they offered, once two DMs have approved the trade.
          </TypographyParagraph>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                const result = actionResultToResult(await approveBuyRequest(auctionId));
                result.match(
                  () => toast({ title: "Trade approved" }),
                  (error) =>
                    toast({
                      title: "Error approving trade",
                      description: error.message,
                      variant: "destructive",
                    }),
                );
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">Deny Trade</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          </AlertDialogHeader>
          <TypographyParagraph>
            This will deny the trade and mark the auction as buy request rejected. The buyer will not receive the thingy
            they requested, and you will not receive the thingy they offered.
          </TypographyParagraph>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                const result = actionResultToResult(await rejectBuyRequest(auctionId));
                result.match(
                  () => toast({ title: "Trade rejected" }),
                  (error) =>
                    toast({
                      title: "Error rejecting trade",
                      description: error.message,
                      variant: "destructive",
                    }),
                );
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
