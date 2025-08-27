"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { z } from "zod";
import { CalendarIcon, Edit } from "lucide-react";
import { format } from "date-fns";

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
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { editPollFormSchema } from "@/config/when2dnd";
import { cn } from "@/utils/styling";
import { editWhen2DnDPoll } from "@/server/when2dnd";
import { getEndOfDate, getMidnightOfDate } from "@/utils/formatting";
import { actionResultToResult } from "@/types/error-typing";
import { ScrollArea } from "@/components/ui/scroll-area";

export function EditPollSheet({
  title,
  dateRange,
  deadline,
  pollId,
}: {
  title: string;
  dateRange: { from: Date; to: Date };
  deadline: Date | undefined;
  pollId: string;
}) {
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof editPollFormSchema>>({
    resolver: zodResolver(editPollFormSchema),
    defaultValues: {
      title,
      dateRange,
      deadline,
    },
  });

  const onSubmit = async (values: z.infer<typeof editPollFormSchema>) => {
    startTransition(async () => {
      const result = actionResultToResult(await editWhen2DnDPoll(values, pollId));

      result.match(
        () => {
          toast({
            title: "Poll Updated",
            description: `Your When2DnD poll has been updated.`,
          });
        },
        (error) => {
          toast({
            title: "Error Creating Poll",
            description: error.message,
            variant: "destructive",
          });
        },
      );
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="w-fit ml-auto">
          <Edit className="w-5 h-5 mb-0.5 mr-1.5" />
          Edit the Poll
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-fit sm:w-full w-fit p-0 py-6">
        <ScrollArea className="h-full px-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-fit px-1 space-y-6">
              <SheetHeader>
                <SheetTitle>Edit When2DnD Poll</SheetTitle>
                <SheetDescription className="flex flex-col gap-1">
                  <span>The easiest way to schedule your Dungeons & Dragons sessions.</span>
                  <span className="font-quotes">All times are in your local timezone.</span>
                </SheetDescription>
              </SheetHeader>
              <FormField
                control={form.control}
                name="title"
                disabled={pending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="We Killin' the Dragon" {...field} />
                    </FormControl>
                    <FormDescription>This is the title for the when2dnd poll.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateRange"
                disabled={pending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date Range</FormLabel>
                    <FormControl>
                      <Calendar
                        mode="range"
                        defaultMonth={field.value.from}
                        numberOfMonths={2}
                        selected={field.value}
                        onSelect={(dateRange) => {
                          if (dateRange?.from && dateRange?.to) {
                            field.onChange({
                              from: getMidnightOfDate(dateRange.from),
                              to: getEndOfDate(dateRange.to),
                            });
                          } else if (dateRange?.from) {
                            field.onChange({
                              from: getMidnightOfDate(dateRange.from),
                              to: getEndOfDate(dateRange.from),
                            });
                          } else {
                            field.onChange(dateRange);
                          }
                        }}
                        className="rounded-lg border-2 shadow-md border-border xs:[--cell-size:--spacing(10)] sm:[--cell-size:--spacing(12)] md:[--cell-size:--spacing(10)] lg:[--cell-size:--spacing(11)]"
                        disabled={{
                          before: getMidnightOfDate(new Date(Date.now() - 3 * 7 * 24 * 60 * 60 * 1000)), // three weeks ago
                          after: getEndOfDate(new Date(4 * 7 * 24 * 60 * 60 * 1000 + Date.now())), // four weeks from now
                        }}
                      />
                    </FormControl>
                    <FormDescription>This is date range that the players can choose from.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Deadline</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
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
                          disabled={{
                            before: getMidnightOfDate(new Date()),
                          }}
                          captionLayout="dropdown"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>The deadline for the when2dnd poll. This is optional.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <SheetFooter>
                <Button type="submit" disabled={pending}>
                  Submit
                </Button>
                <SheetClose asChild>
                  <Button variant="outline" disabled={pending}>
                    Close
                  </Button>
                </SheetClose>
              </SheetFooter>
            </form>
          </Form>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
