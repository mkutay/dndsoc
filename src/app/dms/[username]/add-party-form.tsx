"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Check, ChevronsUpDown } from "lucide-react";
import { startTransition, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import Server from "@/server/server";
import { Tables } from "@/types/database.types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { TypographyLink } from "@/components/typography/paragraph";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { DialogFooter } from "@/components/ui/dialog";

type Party = Tables<"parties">;

const addPartyForDM = z.object({
  party: z.string().optional(),
});

export function AddPartyForm({
  DMUuid,
  parties,
  setOptimisticParties,
  setOpen,
}: {
  DMUuid: string,
  parties: Party[],
  setOptimisticParties: (action: {
    type: "add";
    party: Party;
  } | {
    type: "remove";
    partyId: string;
  }) => void;
  setOpen: (open: boolean) => void;
}) {
  const { toast } = useToast();
  const [pending, setPending] = useState(false);
  
  const form = useForm<z.infer<typeof addPartyForDM>>({
    resolver: zodResolver(addPartyForDM),
    defaultValues: {
      party: "",
    },
  });

  if (parties.length === 0) return null;
 
  const onSubmit = async (values: z.infer<typeof addPartyForDM>) => {
    if (!values.party) return;

    const partyToAdd = parties.find((party) => party.id === values.party)!;
    startTransition(() =>
      setOptimisticParties({
        type: "add",
        party: partyToAdd,
      })
    );
    setPending(true);
    setOpen(false);

    const result = await Server.DMs.Add.Party({ dmUuid: DMUuid, partyId: values.party, revalidate: `/dms/[username]` });

    setPending(false);

    if (!result.ok) {
      toast({
        title: "Add Party Failed",
        description: "Please try again. " + result.error.message,
        variant: "destructive",
      });
      startTransition(() =>
        setOptimisticParties({
          type: "remove",
          partyId: values.party || "",
        })
      );
      setOpen(true);
    } else {
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
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
                      className={cn(
                        "w-[250px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {!field.value && "Select a party..."}
                      {field.value && (() => {
                        const party = parties.find((party) => field.value === party.id);
                        return party ? (
                          <span>
                            <TypographyLink target="_blank" href={`/parties/${party.shortened}`} variant="default">{party.name}</TypographyLink>
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
                      placeholder="Search a party..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No other party found.</CommandEmpty>
                      <CommandGroup>
                        {parties.map((party, index) => (
                          <CommandItem
                            value={party.name}
                            key={index}
                            onSelect={() => {
                              form.setValue("party", party.id)
                            }}
                          >
                            <span>
                              <TypographyLink target="_blank" href={`/parties/${party.shortened}`} variant="default">{party.name}</TypographyLink>
                            </span>
                            <Check
                              className={cn(
                                "ml-auto",
                                party.id === field.value
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
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <div className="w-full flex flex-row justify-end">
            <Button
              type="submit"
              variant="outline"
              size="default"
              disabled={pending}
            >Add</Button>
          </div>
        </DialogFooter>
      </form>
    </Form>
  );
}