"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CalendarIcon, RefreshCcw } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { format } from "date-fns";
import { z } from "zod";

import { TypographyParagraph } from "@/components/typography/paragraph";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { actionResultToResult } from "@/types/error-typing";
import { updateJournalAll } from "@/server/journal";
import { journalEditSchema } from "@/config/journal-schema";
import type { Tables } from "@/types/database.types";
import { convertToShortened } from "@/utils/formatting";
import { cn } from "@/utils/styling";

export function EditJournalAdminSheet({
  journal,
  children,
}: {
  journal: Tables<"journal">;
  children: Readonly<React.ReactNode>;
}) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [open, setOpen] = useState(searchParams.get("edit") === "admin");
  const router = useRouter();

  const setOpenSeachParams = (o: boolean) => {
    if (o) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("edit", "admin");
      router.replace(pathname + "?" + params.toString());
    } else {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("edit");
      router.replace(pathname + "?" + params.toString());
    }
    setOpen(o);
  };

  const form = useForm<z.infer<typeof journalEditSchema>>({
    resolver: zodResolver(journalEditSchema),
    defaultValues: {
      excerpt: journal.excerpt,
      date: new Date(journal.date),
      title: journal.title,
      shortened: journal.shortened,
      journalId: journal.id,
    },
  });

  const onSubmit = (values: z.infer<typeof journalEditSchema>) => {
    startTransition(async () => {
      const result = actionResultToResult(await updateJournalAll(values, pathname));

      result.match(
        () => {
          toast({
            title: "Journal updated successfully!",
            description: "Your journal has been updated.",
            variant: "default",
          });
          setOpenSeachParams(false);
          if (values.shortened !== journal.shortened) {
            router.push(`/journal/${values.shortened}`);
          }
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
    <Sheet open={open} onOpenChange={setOpenSeachParams}>
      <SheetTrigger asChild>
        <Button variant="outline">{children}</Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md sm:p-2 p-0 py-6">
        <ScrollArea className="h-full px-3">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-1">
              <SheetHeader>
                <SheetTitle>Edit</SheetTitle>
                <SheetDescription>
                  Edit the journal entry &quot;{journal.title}.&quot; This is public to all.
                </SheetDescription>
              </SheetHeader>
              <FormField
                control={form.control}
                name="excerpt"
                disabled={isPending}
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
                disabled={isPending}
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
                disabled={isPending}
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
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                            disabled={isPending}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          captionLayout="dropdown"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>This is the date of the journal entry.</FormDescription>
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
