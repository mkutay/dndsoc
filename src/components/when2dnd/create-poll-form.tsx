"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { createPollFormSchema } from "@/config/when2dnd";
import { cn } from "@/utils/styling";
import { createWhen2DnDPoll } from "@/server/when2dnd";
import { getEndOfDate, getMidnightOfDate } from "@/utils/formatting";
import { actionResultToResult } from "@/types/error-typing";

export function CreatePollForm() {
  const { toast } = useToast();
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof createPollFormSchema>>({
    resolver: zodResolver(createPollFormSchema),
    defaultValues: {
      title: "",
      dateRange: {
        from: getMidnightOfDate(new Date()),
        to: getEndOfDate(new Date()),
      },
    },
  });

  const onSubmit = async (values: z.infer<typeof createPollFormSchema>) => {
    setPending(true);
    const result = actionResultToResult(await createWhen2DnDPoll(values));
    setPending(false);

    result.match(
      ({ code }) => {
        toast({
          title: "Poll created",
          description: `Your poll has been created with code ${code}. Share it with your friends!`,
        });
        router.push(`/when2dnd/${code}`);
      },
      (error) => {
        toast({
          title: "Error creating poll",
          description: error.message,
          variant: "destructive",
        });
      },
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 w-fit md:mx-0 mx-auto">
        <p className="text-left font-quotes text-base">*All times are in your local timezone</p>
        <div className="space-y-6 mt-2">
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
                      before: getMidnightOfDate(new Date()),
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
                        className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
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
        </div>
        <Button type="submit" disabled={pending} className="mt-6">
          Submit
        </Button>
      </form>
    </Form>
  );
}
