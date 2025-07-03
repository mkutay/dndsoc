"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";

import { RefreshCcw } from "lucide-react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Tables } from "@/types/database.types";
import { journalPartyEntryEditSchema } from "@/config/journal-schema";
import { actionResultMatch } from "@/types/error-typing";
import { updateJournalPartyEntry } from "@/server/journal";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function PartyEntryForm({
  entry,
}: {
  entry: Tables<"party_entries"> & {
    parties: Tables<"parties">;
    journal: Tables<"journal">;
  };
}) {
  const { toast } = useToast();
  const [pending, setPending] = useState(false);

  const form = useForm<z.infer<typeof journalPartyEntryEditSchema>>({
    resolver: zodResolver(journalPartyEntryEditSchema),
    defaultValues: {
      text: entry.text,
    },
  });

  const onSubmit = async (data: z.infer<typeof journalPartyEntryEditSchema>) => {
    setPending(true);
    const result = await updateJournalPartyEntry(entry.journal.id, entry.parties.id, data);
    setPending(false);

    actionResultMatch(
      result,
      () =>
        toast({
          title: "Journal updated successfully!",
          description: "Your journal entry has been updated.",
          variant: "default",
        }),
      (error) =>
        toast({
          title: "Error updating journal",
          description: error.message,
          variant: "destructive",
        }),
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-prose mt-6">
        <FormField
          control={form.control}
          name="text"
          disabled={pending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Entry</FormLabel>
              <FormControl>
                <Textarea placeholder="I am awesome!" className="w-full min-h-[160px]" {...field} />
              </FormControl>
              <FormDescription>
                This is the journal entry for {entry.parties.name} in the {entry.journal.title} journal.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-row gap-2">
          <Button type="submit" disabled={pending}>
            Submit
          </Button>
          <Button type="reset" variant="ghost" size="icon" disabled={pending} onClick={() => form.reset()}>
            <RefreshCcw />
          </Button>
        </div>
      </form>
    </Form>
  );
}
