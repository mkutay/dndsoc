"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CalendarIcon, MinusCircle, PlusCircle } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { format } from "date-fns";
import { z } from "zod";

import { Input } from "./ui/input";
import { TypographyLarge } from "./typography/paragraph";
import { Calendar } from "./ui/calendar";
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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { actionResultToResult } from "@/types/error-typing";
import type { Tables } from "@/types/database.types";
import { editPollSchema } from "@/config/poll-schema";
import { editPoll } from "@/server/polls";
import { convertToShortened } from "@/utils/formatting";
import { cn } from "@/utils/styling";

export function PollEditSheet({
  poll,
  children,
}: {
  poll: Tables<"polls"> & {
    options: {
      text: string;
      id: string;
    }[];
  };
  children: React.ReactNode;
}) {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [open, setOpen] = useState(searchParams.get("edit") === "true");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const setOpenSeachParams = (o: boolean) => {
    if (o) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("edit", "true");
      router.replace(pathname + "?" + params.toString());
    } else {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("edit");
      router.replace(pathname + "?" + params.toString());
    }
    setOpen(o);
  };

  const form = useForm<z.infer<typeof editPollSchema>>({
    resolver: zodResolver(editPollSchema),
    defaultValues: {
      question: poll.question,
      expiresAt: poll.expires_at ? new Date(poll.expires_at) : undefined,
      shortened: poll.shortened,
      options: poll.options,
      pollId: poll.id,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "options",
  });

  const onSubmit = (values: z.infer<typeof editPollSchema>) => {
    startTransition(async () => {
      const result = actionResultToResult(await editPoll(values, pathname));

      result.match(
        () => {
          toast({
            title: "Poll Updated",
            description: "The poll has been updated successfully.",
            variant: "default",
          });
          setOpenSeachParams(false);
          if (values.shortened !== poll.shortened) {
            router.push(`/polls/${values.shortened}`);
          }
        },
        (error) =>
          toast({
            title: "Error Updating Poll",
            description: error.message,
            variant: "destructive",
          }),
      );
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpenSeachParams}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="sm:max-w-md sm:p-2 p-0 py-6">
        <ScrollArea className="h-full px-3">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-1">
              <SheetHeader>
                <SheetTitle>Edit</SheetTitle>
                <SheetDescription>Edit your party&apos;s public page. This is visible to everyone.</SheetDescription>
              </SheetHeader>
              <FormField
                control={form.control}
                name="question"
                disabled={isPending}
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
                    <FormDescription>This is the question of the poll.</FormDescription>
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
                    <FormDescription>This is the shortened version of the question, used in URLs.</FormDescription>
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
                                !field.value && "text-muted-foreground",
                              )}
                              disabled={isPending}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <Button
                          variant="destructive"
                          size="icon"
                          disabled={isPending}
                          type="button"
                          onClick={() => {
                            field.onChange(undefined);
                          }}
                        >
                          <MinusCircle className="w-4 h-4" />
                        </Button>
                      </div>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          captionLayout="dropdown"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      This is the date when the poll expires. After this date, no more votes can be cast.
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
                        <FormLabel>Option {index + 1}</FormLabel>
                        <FormControl>
                          <div className="w-full items-center flex flex-row gap-2">
                            <Input {...field} disabled={isPending} className="w-full" />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              disabled={isPending || fields.length <= 2}
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
                  disabled={isPending}
                  onClick={() => append({ text: "" })}
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Option
                </Button>
                <FormField
                  control={form.control}
                  name={`options`}
                  render={() => (
                    <FormItem>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <SheetFooter>
                <Button type="submit" disabled={isPending}>
                  Submit
                </Button>
                <SheetClose asChild>
                  <Button variant="outline" disabled={isPending}>
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
