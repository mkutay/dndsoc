"use client";

import { useFieldArray, useForm, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, RotateCcw, Trash } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import type { z } from "zod";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { TypographyH3 } from "@/components/typography/headings";
import { pollVoteFormSchema } from "@/config/when2dnd";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { addVoteToWhen2DnDPoll } from "@/server/when2dnd";
import { actionResultMatch } from "@/types/error-typing";
import { getMidnightOfDate } from "@/utils/formatting";

function DateTimeSelection({
  control,
  dateIndex,
  date,
  onRemoveDate,
  pending,
}: {
  control: Control<z.infer<typeof pollVoteFormSchema>>;
  dateIndex: number;
  date: Date;
  onRemoveDate: () => void;
  pending: boolean;
}) {
  const {
    fields: timeFields,
    append: timeAppend,
    remove: timeRemove,
  } = useFieldArray({
    control,
    name: `dateSelections.${dateIndex}.times`,
  });

  const addTimeSlot = () => {
    const startTime = new Date(date);
    startTime.setHours(9, 0, 0, 0); // Default to 9 AM

    const endTime = new Date(date);
    endTime.setHours(17, 0, 0, 0); // Default to 5 PM

    timeAppend({
      from: startTime,
      to: endTime,
    });
  };

  return (
    <div className="px-3 py-2 rounded-md border-2 border-border shadow-md w-full">
      <div className="flex items-center justify-between mb-2">
        <p className="font-medium">{format(date, "PP")}</p>
        <Button type="button" variant="secondary" size="xs" onClick={onRemoveDate} disabled={pending}>
          Remove Day
        </Button>
      </div>

      {timeFields.map((timeField, timeIndex) => (
        <div key={timeField.id} className="flex items-start gap-2 mb-2">
          <FormField
            control={control}
            name={`dateSelections.${dateIndex}.times.${timeIndex}`}
            disabled={pending}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <div className="flex items-center gap-2 w-full">
                    <div className="flex-1">
                      <Label htmlFor="time-from" className="sr-only">
                        Start Time
                      </Label>
                      <Input
                        id="time-from"
                        type="time"
                        disabled={pending}
                        value={field.value.from ? format(field.value.from, "HH:mm") : ""}
                        onChange={(e) => {
                          if (e.target.value) {
                            const [hours, minutes] = e.target.value.split(":").map(Number);
                            const newDate = new Date(date);
                            newDate.setHours(hours, minutes, 0, 0);
                            field.onChange({
                              from: newDate,
                              to: field.value.to,
                            });
                          }
                        }}
                        className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">to</span>
                    <div className="flex-1">
                      <Label htmlFor="time-to" className="sr-only">
                        End Time
                      </Label>
                      <Input
                        id="time-to"
                        type="time"
                        disabled={pending}
                        value={field.value.to ? format(field.value.to, "HH:mm") : ""}
                        onChange={(e) => {
                          if (e.target.value) {
                            const [hours, minutes] = e.target.value.split(":").map(Number);
                            const newDate = new Date(date);
                            newDate.setHours(hours, minutes, 0, 0);
                            field.onChange({
                              from: field.value.from,
                              to: newDate,
                            });
                          }
                        }}
                        className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                      />
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={() => timeRemove(timeIndex)}
            disabled={pending}
          >
            <Trash className="h-[18px] w-[18px]" />
          </Button>
        </div>
      ))}

      <FormField control={control} name={`dateSelections.${dateIndex}`} render={() => <FormMessage />} />

      <FormField control={control} name={`dateSelections.${dateIndex}.times`} render={() => <FormMessage />} />

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addTimeSlot}
        className="w-full mt-2"
        disabled={pending}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Time Slot
      </Button>
    </div>
  );
}

export function PollVoteForm({
  authUserUuid,
  pollId,
  dateRange,
  createdAt,
  deadline,
  title,
  votes,
}: {
  authUserUuid: string;
  pollId: string;
  dateRange: { from: Date; to: Date };
  createdAt: Date;
  deadline?: Date;
  title: string;
  votes: {
    from: Date;
    to: Date;
    id: string;
  }[];
}) {
  const { toast } = useToast();
  const [pending, setPending] = useState(false);

  const form = useForm<z.infer<typeof pollVoteFormSchema>>({
    resolver: zodResolver(pollVoteFormSchema),
    defaultValues: {
      dateRange,
      dateSelections: (() => {
        if (votes.length === 0) return [];
        const days = new Set(votes.map((vote) => getMidnightOfDate(vote.from).toISOString()));
        return Array.from(days).map((day) => {
          const times = votes
            .filter((vote) => getMidnightOfDate(vote.from).toISOString() === day)
            .map((vote) => ({
              from: vote.from,
              to: vote.to,
            }));
          return {
            date: new Date(day),
            times,
          };
        });
      })(),
    },
  });

  const { fields: dateSelectionFields, replace: dateSelectionReplace } = useFieldArray({
    control: form.control,
    name: "dateSelections",
  });

  const onSubmit = async (values: z.infer<typeof pollVoteFormSchema>) => {
    setPending(true);
    const result = await addVoteToWhen2DnDPoll(values, {
      pollId,
      authUserUuid,
    });
    setPending(false);

    actionResultMatch(
      result,
      () => {
        toast({
          title: "Vote submitted successfully!",
          description: "Your availability has been recorded.",
        });
        window.location.reload();
      },
      (error) => {
        toast({
          title: "Error submitting vote",
          description: error.message,
          variant: "destructive",
        });
      },
    );
  };

  const onSelectionChange = (selections: Date[] | undefined) => {
    if (!selections) {
      dateSelectionReplace([]);
      return;
    }

    const newDateSelections = selections
      .sort((a, b) => a.getTime() - b.getTime())
      .map((selection) => {
        // Check if this date already exists in the current fields
        const existing = dateSelectionFields.find((field) => field.date.getTime() === selection.getTime());

        if (existing) {
          return existing;
        }

        const startTime = new Date(selection);
        startTime.setHours(9, 0, 0, 0);

        const endTime = new Date(selection);
        endTime.setHours(17, 0, 0, 0);

        return {
          date: selection,
          times: [{ from: startTime, to: endTime }],
        };
      });

    dateSelectionReplace(newDateSelections);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 w-full">
        <Card className="w-full mt-6">
          <CardHeader>
            <CardTitle>Vote On: {title}</CardTitle>
            <CardDescription>Select the dates and times you are available in your current timezone.</CardDescription>
            <p className="text-base mt-3">
              The poll is active between: {format(createdAt, "PP")} — {deadline ? format(deadline, "PP") : "∞"}
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-left font-quotes text-base">*All times are in your local timezone</p>
            <div className="flex lg:flex-row flex-col gap-4 lg:divide-x-2 lg:divide-y-0 divide-x-0 divide-y-2 divide-border mt-2">
              <div>
                <TypographyH3>Dates</TypographyH3>
                <p className="font-quotes text-base mt-1">
                  Select the dates you are available. You can select multiple dates.
                </p>
                <FormField
                  control={form.control}
                  name="dateSelections"
                  disabled={pending}
                  render={({ field }) => (
                    <FormItem className="w-fit lg:pr-4 pb-4 mt-4">
                      <FormControl>
                        <Calendar
                          mode="multiple"
                          // defaultMonth={field.value}
                          numberOfMonths={2}
                          selected={field.value.map(({ date }) => date)}
                          onSelect={onSelectionChange}
                          className="rounded-lg border-2 shadow-md border-border xs:[--cell-size:--spacing(10)] sm:[--cell-size:--spacing(11)] md:[--cell-size:--spacing(9)] lg:[--cell-size:--spacing(10)]"
                          disabled={{
                            before: dateRange.from,
                            after: dateRange.to,
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col w-full">
                <TypographyH3>Availability</TypographyH3>
                <p className="font-quotes text-base mt-1">These are your available timeslots.</p>
                <div className="flex flex-col gap-4 mt-4">
                  {dateSelectionFields.map((field, index) => (
                    <DateTimeSelection
                      key={field.id}
                      control={form.control}
                      dateIndex={index}
                      date={field.date}
                      onRemoveDate={() => {
                        const newSelections = dateSelectionFields.filter((_, i) => i !== index);
                        dateSelectionReplace(newSelections);
                      }}
                      pending={pending}
                    />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={pending}>
              Submit
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              disabled={pending}
              onClick={() => {
                form.reset();
              }}
              className="ml-2"
            >
              <RotateCcw />
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
