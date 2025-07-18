"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { CalendarIcon, RefreshCcw } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { journalAllEditSchema } from "@/config/journal-schema";
import { type Tables } from "@/types/database.types";
import { useToast } from "@/hooks/use-toast";
import { convertToShortened } from "@/utils/formatting";
import { cn } from "@/utils/styling";
import { TypographyLarge } from "@/components/typography/paragraph";
import { Calendar } from "@/components/ui/calendar";
import { updateJournalAll } from "@/server/journal";
import { actionResultMatch } from "@/types/error-typing";

export function JournalEditForm({
  journal,
  allParties,
  partyEntries,
}: {
  journal: Tables<"journal">;
  allParties: Tables<"parties">[];
  partyEntries: (Tables<"party_entries"> & {
    parties: Tables<"parties">;
  })[];
}) {
  const { toast } = useToast();
  const [pending, setPending] = useState(false);

  const entries = allParties.map((party) => ({
    partyId: party.id,
    text: partyEntries.find((entry) => entry.parties.id === party.id)?.text ?? "",
    name: party.name,
    shortened: party.shortened,
  }));

  const form = useForm<z.infer<typeof journalAllEditSchema>>({
    resolver: zodResolver(journalAllEditSchema),
    defaultValues: {
      excerpt: journal.excerpt,
      date: new Date(journal.date),
      title: journal.title,
      shortened: journal.shortened,
      entries: entries.map((entry) => ({
        partyId: entry.partyId,
        text: entry.text,
      })),
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "entries",
  });

  const onSubmit = async (data: z.infer<typeof journalAllEditSchema>) => {
    setPending(true);
    const result = await updateJournalAll(journal.id, data);
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
          name="excerpt"
          disabled={pending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Excerpt</FormLabel>
              <FormControl>
                <Textarea placeholder="I am awesome!" className="w-full min-h-[160px]" {...field} />
              </FormControl>
              <FormDescription>This is a short excerpt of the journal entry.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          disabled={pending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="My Awesome Journal Entry"
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value);
                    form.setValue("shortened", convertToShortened(value));
                  }}
                />
              </FormControl>
              <FormDescription>This is the journal entry title.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="shortened"
          disabled={pending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shortened</FormLabel>
              <FormControl>
                <Input placeholder="shoort" {...field} />
              </FormControl>
              <FormDescription>This is the shortened version of the title, used in URLs.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                      disabled={pending}
                    >
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={field.value} onSelect={field.onChange} captionLayout="dropdown" />
                </PopoverContent>
              </Popover>
              <FormDescription>This is the date of the journal entry.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col gap-4">
          <TypographyLarge>Party Entries</TypographyLarge>
          {fields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`entries.${index}.text`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Entry for the Party {allParties.find((p) => p.id === entries[index]?.partyId)?.name ?? "Unknown"}
                  </FormLabel>
                  <FormControl>
                    <div className="relative w-full items-center">
                      <Textarea {...field} disabled={pending} className="w-full min-h-[160px]" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
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
