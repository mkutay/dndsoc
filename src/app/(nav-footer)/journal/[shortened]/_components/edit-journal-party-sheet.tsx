"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { RefreshCcw } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, useTransition } from "react";

import { TypographyParagraph } from "@/components/typography/paragraph";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { actionResultToResult } from "@/types/error-typing";
import { updateJournalPartyEntry } from "@/server/journal";
import { journalPartyEntryEditSchema } from "@/config/journal-schema";

export function EditJournalPartySheet({
  journal,
  children,
}: {
  journal: {
    id: string;
    text: string;
    location: string;
    title: string;
    party: {
      id: string;
      name: string;
      shortened: string;
    };
  };
  children: React.ReactNode;
}) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof journalPartyEntryEditSchema>>({
    resolver: zodResolver(journalPartyEntryEditSchema),
    defaultValues: {
      text: journal.text,
      journalId: journal.id,
      partyId: journal.party.id,
      location: journal.location,
    },
  });

  const onSubmit = (values: z.infer<typeof journalPartyEntryEditSchema>) => {
    startTransition(async () => {
      const result = actionResultToResult(await updateJournalPartyEntry(values, pathname));

      result.match(
        () => {
          toast({
            title: "Journal updated successfully!",
            description: "Your journal entry has been updated.",
            variant: "default",
          });
          setOpen(false);
        },
        (error) =>
          toast({
            title: "Error updating journal",
            description: error.message,
            variant: "destructive",
          }),
      );
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="sm:max-w-md sm:p-2 p-0 py-6">
        <ScrollArea className="h-full px-3">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-1">
              <SheetHeader>
                <SheetTitle>Edit</SheetTitle>
                <SheetDescription>
                  Edit the journal entry for {journal.party.name} in the {journal.title} journal. This is public to all.
                </SheetDescription>
              </SheetHeader>
              <FormField
                control={form.control}
                name="text"
                disabled={isPending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entry</FormLabel>
                    <FormControl>
                      <Textarea placeholder="I am awesome!" className="w-full min-h-[160px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                disabled={isPending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Textarea placeholder="The Gobbledok Tavern" className="w-full min-h-[40px]" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is the location of the party when this entry was made. In other words, the location of the
                      party in the last session.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <SheetFooter className="flex sm:flex-row sm:justify-between items-end w-full gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="reset"
                        variant="ghost"
                        size="icon"
                        disabled={isPending}
                        onClick={() => form.reset()}
                      >
                        <RefreshCcw />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <TypographyParagraph>
                        Reset the form to the original values. This will not save any changes made.
                      </TypographyParagraph>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <div className="flex flex-row gap-2 items-center sm:w-fit w-full">
                  <SheetClose asChild className="sm:w-fit w-full">
                    <Button variant="outline" disabled={isPending}>
                      Close
                    </Button>
                  </SheetClose>
                  <Button type="submit" disabled={isPending} className="sm:w-fit w-full">
                    Submit
                  </Button>
                </div>
              </SheetFooter>
            </form>
          </Form>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
