"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { useOptimistic, useTransition, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { TypographyLink } from "@/components/typography/paragraph";
import { TypographyH2 } from "@/components/typography/headings";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/utils/styling";
import { Character } from "@/types/full-database.types";
import { CharacterCard } from "@/components/character-card";
import { addCharacterToParty, removeCharacterFromParty } from "@/server/characters";

type CharacterAction = { type: "add"; character: Character } | { type: "remove"; characterId: string };

export const addCharacterForPartySchema = z.object({
  character: z.string().optional(),
});

export function Characters({
  characters,
  ownsAs,
  partyId,
  allCharacters,
}: {
  characters: Character[];
  ownsAs: "dm" | "player" | "admin" | null;
  partyId: string;
  allCharacters?: Character[];
}) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [optimisticCharacters, updateOptimisticCharacters] = useOptimistic(
    characters,
    (state, action: CharacterAction) => {
      switch (action.type) {
        case "add":
          return [...state, action.character];
        case "remove":
          return state.filter((c) => c.id !== action.characterId);
      }
    },
  );

  // Sort characters by name
  const sortedCharacters = [...optimisticCharacters].sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });

  const handleRemoveCharacter = async (character: Character) => {
    startTransition(async () => {
      updateOptimisticCharacters({ type: "remove", characterId: character.id });

      const result = await removeCharacterFromParty({
        characterId: character.id,
        partyId,
        shortened: character.shortened,
      });

      if (!result.ok) {
        toast({
          title: "Could Not Remove Character",
          description: result.error.message,
          variant: "destructive",
        });
      }
    });
  };

  const handleAddCharacter = async (character: Character) => {
    startTransition(async () => {
      updateOptimisticCharacters({ type: "add", character });

      const result = await addCharacterToParty({
        characterId: character.id,
        partyId,
        shortened: character.shortened,
      });

      if (!result.ok) {
        toast({
          title: "Add Character Failed",
          description: result.error.message,
          variant: "destructive",
        });
      }
    });
  };

  const availableCharacters =
    allCharacters?.filter((character) => !optimisticCharacters.some((c) => c.id === character.id)) ?? [];

  const canModify = ownsAs === "dm" || ownsAs === "admin";

  return (
    <div className="mt-6 flex flex-col">
      <TypographyH2>Characters</TypographyH2>
      <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 mt-6">
        {sortedCharacters.map((character) => (
          <CharacterCard
            key={character.id}
            character={character}
            ownsAs={ownsAs}
            onRemove={() => handleRemoveCharacter(character)}
            isLoading={isPending}
            removeText="Remove this PC from the party. You can add it later."
          />
        ))}
        {canModify && availableCharacters.length > 0 ? (
          <AddCharacterCard characters={availableCharacters} onAdd={handleAddCharacter} isLoading={isPending} />
        ) : null}
      </div>
    </div>
  );
}

function AddCharacterCard({
  characters,
  onAdd,
  isLoading,
}: {
  characters: Character[];
  onAdd: (character: Character) => void;
  isLoading: boolean;
}) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof addCharacterForPartySchema>>({
    resolver: zodResolver(addCharacterForPartySchema),
    defaultValues: {
      character: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof addCharacterForPartySchema>) => {
    if (!values.character) return;

    const character = characters.find((c) => c.id === values.character);
    if (character) {
      onAdd(character);
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
          <Card className="text-3xl font-book-card-titles tracking-widest">Add Character</Card>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Character</DialogTitle>
          <DialogDescription>You can select a new character to add to your party.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
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
                          className={cn("w-[250px] justify-between", !field.value && "text-muted-foreground")}
                        >
                          {!field.value && "Select a character..."}
                          {field.value
                            ? (() => {
                                const character = characters.find((character) => field.value === character.id);
                                return character ? (
                                  <span>
                                    <TypographyLink
                                      target="_blank"
                                      href={`/characters/${character.shortened}`}
                                      variant="default"
                                    >
                                      {character.name}
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
                        <CommandInput placeholder="Search a character..." className="h-9" />
                        <CommandList>
                          <CommandEmpty>No other characters found.</CommandEmpty>
                          <CommandGroup>
                            {characters.map((character) => (
                              <CommandItem
                                value={character.name}
                                key={character.id}
                                onSelect={() => {
                                  form.setValue("character", character.id);
                                }}
                              >
                                <span>
                                  <TypographyLink
                                    target="_blank"
                                    href={`/characters/${character.shortened}`}
                                    variant="default"
                                  >
                                    {character.name}
                                  </TypographyLink>
                                </span>
                                <Check
                                  className={cn("ml-auto", character.id === field.value ? "opacity-100" : "opacity-0")}
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
