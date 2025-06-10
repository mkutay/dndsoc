"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";

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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { journalCreateSchema } from "@/config/journal-schema";
import { Input } from "@/components/ui/input";
import { Tables } from "@/types/database.types";
import { createJournal } from "@/server/journal";
import { actionResultMatch } from "@/types/error-typing";
import { cn } from "@/lib/utils";
import { TypographyLink } from "@/components/typography/paragraph";

export function CreateJournal({
  campaigns,
}: {
  campaigns: Tables<"campaigns">[];
}) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const form = useForm<z.infer<typeof journalCreateSchema>>({
    resolver: zodResolver(journalCreateSchema),
    defaultValues: {
      title: "",
      campaignId: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof journalCreateSchema>) => {
    setIsPending(true);
    const result = await createJournal(data);
    setIsPending(false);

    actionResultMatch(
      result,
      (shortened) => {
        toast({
          title: "Success: Journal created",
          description: "You can now edit your journal.",
          variant: "default",
        });
        setOpen(false);
        redirect(`/journal/${shortened}/edit`);
      },
      (error) => {
        toast({
          title: "Error creating journal",
          description: error.message,
          variant: "destructive",
        });
      }
    )
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          type="button"
          className="w-fit mt-4"
        >
          Write a New Journal
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Write a New Journal</DialogTitle>
          <DialogDescription>
            This will create a new journal entry for you to fill out.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="New Journal" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your journal&apos;s title.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="campaignId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Campaign</FormLabel>
                  <Popover modal={true}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[250px] justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                          disabled={isPending}
                        >
                          {!field.value && "Select a campaign..."}
                          {field.value &&
                            (() => {
                              const campaign = campaigns.find(
                                (campaign) => field.value === campaign.id
                              );
                              return campaign ? (
                                <span>
                                  <TypographyLink
                                    target="_blank"
                                    href={`/campaigns/${campaign.shortened}`}
                                    variant="default"
                                  >
                                    {campaign.name}
                                  </TypographyLink>
                                </span>
                              ) : null;
                            })()}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[250px] p-0 pointer-events-auto">
                      <Command>
                        <CommandInput
                          placeholder="Search a campaign..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No other campaign found.</CommandEmpty>
                          <CommandGroup>
                            {campaigns.map((campaign) => (
                              <CommandItem
                                value={campaign.name}
                                key={campaign.id}
                                onSelect={() => {
                                  form.setValue("campaignId", campaign.id);
                                }}
                              >
                                <span>
                                  <TypographyLink
                                    target="_blank"
                                    href={`/campaigns/${campaign.shortened}`}
                                    variant="default"
                                  >
                                    {campaign.name}
                                  </TypographyLink>
                                </span>
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    campaign.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    This is the campaign this journal entry belongs to.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <div className="w-full flex flex-row justify-end">
                <Button
                  type="submit"
                  variant="default"
                  size="default"
                  disabled={isPending}
                >
                  Create
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}