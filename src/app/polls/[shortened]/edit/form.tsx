"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { z } from "zod";

import { useToast } from "@/hooks/use-toast";
import { Tables } from "@/types/database.types";
import { editPollSchema } from "@/config/poll-schema";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, MinusCircle, PlusCircle, RefreshCcw } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { convertToShortened } from "@/utils/formatting";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils/styling";
import { format } from "date-fns";
import { TypographyLarge } from "@/components/typography/paragraph";
import { editPoll } from "@/server/polls";
import { actionResultMatch } from "@/types/error-typing";

export function EditPoll({
  poll
}: {
  poll: Tables<"polls"> & {
    options: Tables<"options">[];
  };
}) {
  const { toast } = useToast();
  const [pending, setPending] = useState(false);

  const form = useForm<z.infer<typeof editPollSchema>>({
    resolver: zodResolver(editPollSchema),
    defaultValues: {
      question: poll.question,
      expiresAt: poll.expires_at ? new Date(poll.expires_at) : null,
      shortened: poll.shortened,
      options: poll.options.map((option) => ({
        text: option.text,
        id: option.id,
      })),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "options",
  });

  const onSubmit = async (data: z.infer<typeof editPollSchema>) => {
    setPending(true);
    const result = await editPoll(poll.id, data);
    setPending(false);

    actionResultMatch(result,
      (r) => {
        toast({
          title: "Poll Updated",
          description: "The poll has been updated successfully.",
          variant: "default",
        });
        console.dir(r, { depth: null });
      },
      (error) => {
        toast({
          title: "Error Updating Poll",
          description: error.message,
          variant: "destructive"
        });
      }
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-prose mt-6">
        <FormField
          control={form.control}
          name="question"
          disabled={pending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Am I awesome?"
                  className="w-full"
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value);
                    form.setValue("shortened", convertToShortened(value));
                  }}
                />
              </FormControl>
              <FormDescription>
                This is the question of the poll.
              </FormDescription>
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
              <FormDescription>
                This is the shortened version of the question, used in URLs.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="expiresAt"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Expires At Date</FormLabel>
              <Popover>
                <div className="flex flex-row gap-2 items-center">
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                        disabled={pending}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <Button
                    variant="destructive"
                    size="icon"
                    disabled={pending}
                    onClick={() => {
                      field.onChange(null);
                    }}
                  >
                    <MinusCircle
                      className="w-4 h-4"
                    />
                  </Button>
                </div>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? field.value : undefined}
                    onSelect={field.onChange}
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                This is the date when the poll expires.
                After this date, no more votes can be cast.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col gap-4">
          <TypographyLarge>Options for the Poll</TypographyLarge>
          {fields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`options.${index}.text`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Option {index + 1}
                  </FormLabel>
                  <FormControl>
                    <div className="w-full items-center flex flex-row gap-2">
                      <Input
                        {...field}
                        disabled={pending}
                        className="w-full"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        disabled={pending || fields.length <= 2}
                        onClick={() => remove(index)}
                      >
                        <MinusCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            className="w-fit"
            disabled={pending}
            onClick={() => append({ text: "" })}
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Option
          </Button>
        </div>
        <div className="flex flex-row gap-2">
          <Button type="submit" disabled={pending}>Submit</Button>
          <Button type="reset" variant="ghost" size="icon" disabled={pending} onClick={() => form.reset()}>
            <RefreshCcw />
          </Button>
        </div>
      </form>
    </Form>
  );
}