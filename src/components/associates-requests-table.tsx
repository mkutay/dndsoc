"use client";

import { Check, X, Mail, User, Calendar, FileText } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { approveAssociatesRequest, rejectAssociatesRequest } from "@/server/associates-requests";
import { useToast } from "@/hooks/use-toast";
import { actionResultMatch } from "@/types/error-typing";

type AssociatesRequest = Tables<"associates_requests"> & {
  decision_by_user: Tables<"users"> | null;
  user: Tables<"users"> | null;
};

interface AssociatesRequestsTableProps {
  requests: AssociatesRequest[];
}

export function AssociatesRequestsTable({ requests }: AssociatesRequestsTableProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleApprove = async (id: string) => {
    setLoading(true);
    const result = await approveAssociatesRequest({ id });
    setLoading(false);

    actionResultMatch(
      result,
      () =>
        toast({
          title: "Request approved successfully",
          description: "The user has been notified via email and can now access our services.",
        }),
      (error) =>
        toast({
          title: "Error approving request",
          description: error.message,
          variant: "destructive",
        }),
    );
  };

  const handleReject = async (id: string) => {
    setLoading(true);
    const result = await rejectAssociatesRequest({ id });
    setLoading(false);

    actionResultMatch(
      result,
      () =>
        toast({
          title: "Request denied",
          description: "The user will not be able to access our services.",
        }),
      (error) =>
        toast({
          title: "Error denying request",
          description: error.message,
          variant: "destructive",
        }),
    );
  };

  if (requests.length === 0) {
    return (
      <TypographyParagraph className="text-center text-muted-foreground">
        No associates requests found.
      </TypographyParagraph>
    );
  }

  return (
    <div className="rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Name</TableHead>
            <TableHead className="text-center">Email</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Created</TableHead>
            <TableHead className="text-center">Notes</TableHead>
            <TableHead className="text-center">Actions</TableHead>
            <TableHead className="text-center">Decision By</TableHead>
            <TableHead className="text-center">User</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>
                <div className="flex items-center justify-center gap-2 text-sm">
                  <User size={20} className="text-muted-foreground" />
                  {request.name}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-row justify-center items-center gap-2">
                  <Mail size={16} className="text-muted-foreground" />
                  <TypographyLink href={`mailto:${request.email}`}>{request.email}</TypographyLink>
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
              <TableCell className="text-center">
                {request.notes ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <FileText size={16} className="mr-1" />
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Request Notes</DialogTitle>
                        <DialogDescription>Notes from {request.name}</DialogDescription>
                      </DialogHeader>
                      <div className="mt-4 p-4 bg-muted rounded-md">
                        <p className="whitespace-pre-wrap">{request.notes}</p>
                      </div>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <span className="text-muted-foreground text-sm">No notes</span>
                )}
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
                          This action cannot be undone. This will send an approval email to the user, allowing them to
                          use our services.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleApprove(request.id)}>Continue</AlertDialogAction>
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
                          This action cannot be undone. This will permanently reject the request.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleReject(request.id)}>Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
              <TableCell className="text-center">
                {request.decision_by_user ? (
                  <TypographyLink
                    href={`/dms/${request.decision_by_user.username}`}
                    className="flex items-center justify-center gap-2 text-sm"
                    target="_blank"
                  >
                    {request.decision_by_user.name}
                  </TypographyLink>
                ) : (
                  <span className="text-muted-foreground text-sm italic">Pending</span>
                )}
              </TableCell>
              <TableCell className="text-center">
                {request.user ? (
                  <TypographyLink
                    href={`/players/${request.user.username}`}
                    className="flex items-center justify-center gap-2 text-sm"
                    target="_blank"
                  >
                    {request.user.name}
                  </TypographyLink>
                ) : request.status === "approved" ? (
                  <span className="text-muted-foreground text-sm italic">Pending</span>
                ) : request.status === "denied" ? (
                  <span className="text-muted-foreground text-sm italic">—</span>
                ) : (
                  <span className="text-muted-foreground text-sm italic">Pending</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
