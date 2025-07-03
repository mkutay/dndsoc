"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tables } from "@/types/database.types";
import { cn } from "@/utils/styling";
import { TypographyLink } from "@/components/typography/paragraph";

type Party = Tables<"parties">;

const addPartyForDMSchema = z.object({
  party: z.string().optional(),
});

export function AddParty({
  parties,
  onAdd,
  isLoading,
}: {
  parties: Party[];
  onAdd: (party: Party) => void;
  isLoading: boolean;
}) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof addPartyForDMSchema>>({
    resolver: zodResolver(addPartyForDMSchema),
    defaultValues: {
      party: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof addPartyForDMSchema>) => {
    if (!values.party) return;

    const party = parties.find((p) => p.id === values.party);
    if (party) {
      onAdd(party);
      form.reset();
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="nothing"
          type="button"
          className="w-full h-full rounded-lg hover:bg-card/80 bg-card min-h-60"
          disabled={isLoading}
          asChild
        >
          <Card className="text-3xl font-book-card-titles tracking-widest">Add Party</Card>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Party</DialogTitle>
          <DialogDescription>You can be a DM for any of the existing parties.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              name="party"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <Popover modal={true}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn("w-[250px] justify-between", !field.value && "text-muted-foreground")}
                        >
                          {!field.value && "Select a party..."}
                          {field.value
                            ? (() => {
                                const party = parties.find((party) => field.value === party.id);
                                return party ? (
                                  <span>
                                    <TypographyLink
                                      target="_blank"
                                      href={`/parties/${party.shortened}`}
                                      variant="default"
                                    >
                                      {party.name}
                                    </TypographyLink>
                                  </span>
                                ) : null;
                              })()
                            : null}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[250px] p-0 pointer-events-auto">
                      <Command>
                        <CommandInput placeholder="Search a party..." className="h-9" />
                        <CommandList>
                          <CommandEmpty>No other party found.</CommandEmpty>
                          <CommandGroup>
                            {parties.map((party) => (
                              <CommandItem
                                value={party.name}
                                key={party.id}
                                onSelect={() => {
                                  form.setValue("party", party.id);
                                }}
                              >
                                <span>
                                  <TypographyLink
                                    target="_blank"
                                    href={`/parties/${party.shortened}`}
                                    variant="default"
                                  >
                                    {party.name}
                                  </TypographyLink>
                                </span>
                                <Check
                                  className={cn("ml-auto", party.id === field.value ? "opacity-100" : "opacity-0")}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <div className="w-full flex flex-row justify-end">
                <Button type="submit" variant="outline" size="default" disabled={isLoading}>
                  Add
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
