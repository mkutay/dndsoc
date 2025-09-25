"use client";

import { useState } from "react";
import { format } from "date-fns";

import { Check, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
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
import { approveAuction, rejectAuction } from "@/server/auctions";
import { actionResultToResult } from "@/types/error-typing";
import { useToast } from "@/hooks/use-toast";
import { TypographyLink, TypographyParagraph } from "@/components/typography/paragraph";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { statusAlertDialog, statusMeaning, statusPretty, statusVariant, type ProcessedAuction } from "@/config/auction";

export function ManageAuctions({ auctions }: { auctions: ProcessedAuction[] }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const handleApprove = async (id: string) => {
    setLoading((prev) => ({ ...prev, [id]: true }));
    const result = actionResultToResult(await approveAuction({ id }));
    setLoading((prev) => ({ ...prev, [id]: false }));

    result.match(
      () =>
        toast({
          title: "Auction approved successfully",
          description: "The auction is now live.",
        }),
      (error) =>
        toast({
          title: "Error approving auction",
          description: error.message,
          variant: "destructive",
        }),
    );
  };

  const handleReject = async (id: string) => {
    setLoading((prev) => ({ ...prev, [id]: true }));
    const result = actionResultToResult(await rejectAuction({ id }));
    setLoading((prev) => ({ ...prev, [id]: false }));

    result.match(
      () =>
        toast({
          title: "Auction rejected",
          description: "The user has been notified.",
        }),
      (error) =>
        toast({
          title: "Error rejecting auction",
          description: error.message,
          variant: "destructive",
        }),
    );
  };

  if (auctions.length === 0) {
    return <TypographyParagraph className="text-center text-muted-foreground">No auctions found.</TypographyParagraph>;
  }

  return (
    <div className="rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Sold Thingy</TableHead>
            <TableHead className="text-center">Seller</TableHead>
            <TableHead className="text-center">Traded Thingy</TableHead>
            <TableHead className="text-center">Trader</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Last Update</TableHead>
            <TableHead className="text-center">Actions</TableHead>
            <TableHead className="text-center">Decision By</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {auctions.map((auction) => (
            <TableRow key={auction.id}>
              <TableCell className="text-center">
                <div>
                  <TypographyLink href={`/auctions/${auction.sold_thingy.shortened}`} target="_blank">
                    {auction.sold_thingy.name}
                  </TypographyLink>
                </div>
              </TableCell>
              <TableCell className="text-center">
                {auction.sold_thingy.character ? (
                  <div>
                    <TypographyLink href={`/characters/${auction.sold_thingy.character.shortened}`} target="_blank">
                      {auction.sold_thingy.character.name}
                    </TypographyLink>
                  </div>
                ) : (
                  <div>—</div>
                )}
              </TableCell>
              <TableCell className="text-center">
                {auction.counter_thingy ? (
                  <div>
                    <TypographyLink href={`/auctions/${auction.counter_thingy.shortened}`} target="_blank">
                      {auction.counter_thingy.name}
                    </TypographyLink>
                  </div>
                ) : (
                  <div>—</div>
                )}
              </TableCell>
              <TableCell className="text-center">
                {auction.counter_thingy && auction.counter_thingy.character ? (
                  <div>
                    <TypographyLink href={`/characters/${auction.counter_thingy.character.shortened}`} target="_blank">
                      {auction.counter_thingy.character.name}
                    </TypographyLink>
                  </div>
                ) : (
                  <div>—</div>
                )}
              </TableCell>
              <TableCell className="text-center">
                <Tooltip>
                  <TooltipTrigger>
                    <Badge variant={statusVariant[auction.status]}>{statusPretty[auction.status]}</Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{statusMeaning[auction.status]}</p>
                  </TooltipContent>
                </Tooltip>
              </TableCell>
              <TableCell className="text-center">
                <div className="text-sm text-muted-foreground">
                  {format(new Date(auction.created_at), "MMM dd, yyyy HH:mm")}
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
                        disabled={
                          loading[auction.id] || !(auction.status === "created" || auction.status === "signed_off")
                        }
                      >
                        <Check size={16} />
                        <span className="sr-only">Approve</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      </AlertDialogHeader>
                      <p>{statusAlertDialog[auction.status].approve}</p>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleApprove(auction.id)}>Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghostDestructive"
                        size="icon"
                        className="h-8 w-8"
                        disabled={
                          loading[auction.id] || !(auction.status === "created" || auction.status === "signed_off")
                        }
                      >
                        <X size={16} />
                        <span className="sr-only">Reject</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      </AlertDialogHeader>
                      <p>{statusAlertDialog[auction.status].reject}</p>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleReject(auction.id)}>Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
              <TableCell className="text-center">
                {auction.dm ? (
                  <div className="flex flex-row justify-center items-center gap-2">
                    <TypographyLink href={`/dms/${auction.dm.username}`}>{auction.dm.name}</TypographyLink>
                  </div>
                ) : (
                  <div>—</div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
