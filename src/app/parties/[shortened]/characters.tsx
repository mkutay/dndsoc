"use client";

import { Check, ChevronsUpDown, MinusCircle } from "lucide-react";
import { startTransition, useOptimistic, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { z } from "zod";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { TypographyLink, TypographyParagraph } from "@/components/typography/paragraph";
import { TypographyH2 } from "@/components/typography/headings";
import { Tables } from "@/types/database.types";
import Server from "@/server/server";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type Character = Tables<"characters">;

export function Characters({
  characters,
  ownsAs,
  partyId,
  allCharacters
}: {
  characters: Character[]; // characters that are already in the party
  ownsAs: "dm" | "player" | "admin" | null;
  partyId: string;
  allCharacters?: Character[]; // all characters, including those not in the party
}) {
  const { toast } = useToast();

  const [optimisticCharacters, setOptimisticCharacters] = useOptimistic(
    characters,
    (currentState, action: {
      type: "add"; character: Character;
    } | {
      type: "remove"; characterId: string;
    }) => action.type === "add"
      ? [...currentState, action.character]
      : currentState.filter((character) => character.id !== action.characterId),
  );

  // sort by name
  optimisticCharacters.sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });

  const onSubmit = async (character: Character) => {
    setOptimisticCharacters({
      type: "remove",
      characterId: character.id,
    });
    const result = await Server.Characters.Remove.Party({ characterId: character.id, partyId, shortened: character.shortened });
    if (!result.ok) {
      toast({
        title: "Could Not Remove Character",
        description: result.error.message,
        variant: "destructive",
      });
      setOptimisticCharacters({
        type: "add",
        character,
      });
    }
  };

  return (
    <div className="mt-6 flex flex-col">
      <TypographyH2>Characters</TypographyH2>
      <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 mt-6">
        {optimisticCharacters.map((character, index) => (
          <Card key={index} className="w-full">
            <CardHeader>
              <CardTitle>{character.name}</CardTitle>
              <CardDescription>
                Level {character.level}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TypographyParagraph>
                {character.about}
              </TypographyParagraph>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href={`/characters/${character.shortened}`}>
                  View {character.name}
                </Link>
              </Button>
                {(ownsAs === "dm" || ownsAs === "admin") && (
                  <form
                    action={async () => { await onSubmit(character); }}
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="destructive" size="icon" type="submit">
                            <MinusCircle size="18px" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <TypographyParagraph>Remove this PC from the party. You are able to add it later.</TypographyParagraph>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </form>
                )}
            </CardFooter>
          </Card>
        ))}
        {(ownsAs === "dm" || ownsAs === "admin") && allCharacters && <AddCharacter
          characters={allCharacters.filter((character) => !optimisticCharacters.some((c) => c.id === character.id))}
          partyUuid={partyId}
          setOptimisticCharacters={setOptimisticCharacters}
        />}
      </div>
    </div>
  )
}

export const addCharacterForPartySchema = z.object({
  character: z.string().optional(),
});

function AddCharacter({
  characters,
  partyUuid,
  setOptimisticCharacters,
}: {
  characters: Character[];
  partyUuid: string;
  setOptimisticCharacters: (action: {
    type: "add";
    character: Character;
  } | {
    type: "remove";
    characterId: string;
  }) => void;
}) {
  const [pending, setPending] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof addCharacterForPartySchema>>({
    resolver: zodResolver(addCharacterForPartySchema),
    defaultValues: {
      character: "",
    },
  });
  
  if (characters.length === 0) return null;

  const onSubmit = async (values: z.infer<typeof addCharacterForPartySchema>) => {
    if (!values.character) return;

    const characterToAdd = characters.find((character) => character.id === values.character)!;
    startTransition(() =>
      setOptimisticCharacters({
        type: "add",
        character: characterToAdd,
      })
    );
    setPending(true);
    setOpen(false);

    const result = await Server.Parties.Add.Character({ characterId: values.character, partyId: partyUuid, shortened: characterToAdd.shortened });

    setPending(false);

    if (!result.ok) {
      toast({
        title: "Add Character Failed",
        description: "Please try again. " + result.error.message,
        variant: "destructive",
      });
      startTransition(() =>
        setOptimisticCharacters({
          type: "remove",
          characterId: values.character || "",
        })
      );
      setOpen(true);
    } else {
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="nothing"
          type="button"
          className="w-full h-full rounded-lg hover:bg-card/80 bg-card min-h-60"
          disabled={pending}
          asChild
        >
          <Card className="text-3xl font-book-card-titles tracking-widest">
            Add Character
          </Card>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Character</DialogTitle>
          <DialogDescription>
            You can select a new character to add to your party.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="character"
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
                          {!field.value && "Select a character..."}
                          {field.value && (() => {
                            const character = characters.find((character) => field.value === character.id);
                            return character ? (
                              <span>
                                <TypographyLink target="_blank" href={`/characters/${character.shortened}`} variant="default">{character.name}</TypographyLink>
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
                          placeholder="Search a character..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No other characters found.</CommandEmpty>
                          <CommandGroup>
                            {characters.map((character, index) => (
                              <CommandItem
                                value={character.name}
                                key={index}
                                onSelect={() => {
                                  form.setValue("character", character.id)
                                }}
                              >
                                <span>
                                  <TypographyLink target="_blank" href={`/characters/${character.shortened}`} variant="default">{character.name}</TypographyLink>
                                </span>
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    character.id === field.value
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
      </DialogContent>
    </Dialog>
  )
}