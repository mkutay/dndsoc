"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { Check, ChevronsUpDown, MinusIcon, PlusIcon, RefreshCcw } from "lucide-react";
import { useState, useTransition } from "react";

import { usePathname, useRouter } from "next/navigation";
import { NumberInput } from "@/components/ui/number-input";
import { TypographyLink } from "@/components/typography/paragraph";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { actionResultToResult } from "@/types/error-typing";
import { cn } from "@/utils/styling";
import { partyDMEditSchema } from "@/config/parties";
import { updateDMParty } from "@/server/parties";

type Character = {
  id: string;
  name: string;
  shortened: string;
  player: {
    id: string;
    username: string;
    name: string;
  };
};

export function EditPartyDMSheet({
  party,
  children,
  path,
  characters,
  edit,
}: {
  party: {
    name: string;
    about: string;
    level: number;
    id: string;
    characters: Character[];
  };
  characters: Character[];
  children: React.ReactNode;
  path: string;
  edit: boolean;
}) {
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(edit);
  const [charactersDialogOpen, setCharactersDialogOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const setOpenSeachParams = (o: boolean) => {
    if (edit) router.replace(pathname);
    setOpen(o);
  };

  const form = useForm<z.infer<typeof partyDMEditSchema>>({
    resolver: zodResolver(partyDMEditSchema),
    defaultValues: {
      about: party.about,
      level: party.level,
      name: party.name,
      partyId: party.id,
      characters: party.characters.map((character) => ({
        id: character.id,
      })),
      selectedCharacter: "",
      selectedCampaign: "",
      selectedDM: "",
    },
  });

  const {
    fields: charactersFields,
    append: charactersAppend,
    remove: charactersRemove,
  } = useFieldArray({
    control: form.control,
    name: "characters",
  });

  const onSubmit = async (values: z.infer<typeof partyDMEditSchema>) => {
    startTransition(async () => {
      const result = actionResultToResult(await updateDMParty(values, path));

      result.match(
        () => {
          toast({
            title: "Update Successful",
            description: "Your party has been updated.",
          });
          setOpenSeachParams(false);
        },
        (error) =>
          toast({
            title: "Update Failed",
            description: "Please try again. " + error.message,
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
                <SheetDescription>Edit your parties page. This is visible to everyone.</SheetDescription>
              </SheetHeader>
              <FormField
                control={form.control}
                name="image"
                disabled={pending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)}
                        disabled={field.disabled}
                      />
                    </FormControl>
                    <FormDescription>Upload a new image for your party.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                disabled={pending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Dragonslayers" {...field} />
                    </FormControl>
                    <FormDescription>This is your party&apos;s name.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="level"
                disabled={pending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Level</FormLabel>
                    <FormControl>
                      <NumberInput
                        value={field.value}
                        onValueChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormDescription>This is your parties level.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="about"
                disabled={pending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>About</FormLabel>
                    <FormControl>
                      <Textarea placeholder="We are awesome!" {...field} />
                    </FormControl>
                    <FormDescription>This is your party&apos;s public about.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                {charactersFields.map((field, index) => (
                  <FormField
                    control={form.control}
                    key={field.id}
                    name={`characters.${index}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={cn(index !== 0 ? "hidden" : "flex")}>Characters</FormLabel>
                        <FormControl>
                          <div className="relative w-full items-center">
                            <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm">
                              {!field.value && "Select a character..."}
                              {field.value
                                ? (() => {
                                    const character = characters.find((char) => field.value.id === char.id);
                                    return character ? (
                                      <span>
                                        <TypographyLink
                                          target="_blank"
                                          href={`/characters/${character.shortened}`}
                                          variant="default"
                                        >
                                          {character.name}
                                        </TypographyLink>{" "}
                                        (played by{" "}
                                        <TypographyLink
                                          href={`/players/${character.player.username}`}
                                          target="_blank"
                                          variant="default"
                                        >
                                          {character.player.name}
                                        </TypographyLink>
                                        )
                                      </span>
                                    ) : null;
                                  })()
                                : null}
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full shrink-0"
                              onClick={() => {
                                charactersRemove(index);
                              }}
                              disabled={pending}
                            >
                              <MinusIcon size={14} />
                            </Button>
                          </div>
                        </FormControl>
                        <FormDescription className={cn(index !== charactersFields.length - 1 ? "hidden" : "flex")}>
                          These are your party&apos;s characters.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                <Dialog open={charactersDialogOpen} onOpenChange={setCharactersDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="mt-2 space-x-1 items-center" disabled={pending}>
                      <PlusIcon size="18px" />
                      <span>Add Character</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Character</DialogTitle>
                      <DialogDescription>You can add a new character to your party.</DialogDescription>
                    </DialogHeader>
                    <FormField
                      control={form.control}
                      name="selectedCharacter"
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
                                        const character = characters.find((char) => field.value === char.id);
                                        return character ? (
                                          <span>
                                            <TypographyLink
                                              target="_blank"
                                              href={`/characters/${character.shortened}`}
                                              variant="default"
                                            >
                                              {character.name}
                                            </TypographyLink>{" "}
                                            (played by{" "}
                                            <TypographyLink
                                              href={`/players/${character.player.username}`}
                                              target="_blank"
                                              variant="default"
                                            >
                                              {character.player.name}
                                            </TypographyLink>
                                            )
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
                                  <CommandEmpty>No other character found.</CommandEmpty>
                                  <CommandGroup>
                                    {characters.map(
                                      (character) =>
                                        !form
                                          .getValues("characters")
                                          .some((selectedChar) => selectedChar.id === character.id) && (
                                          <CommandItem
                                            value={character.name}
                                            key={character.id}
                                            onSelect={() => {
                                              form.setValue("selectedCharacter", character.id);
                                            }}
                                          >
                                            <span>
                                              <TypographyLink
                                                target="_blank"
                                                href={`/characters/${character.shortened}`}
                                                variant="default"
                                              >
                                                {character.name}
                                              </TypographyLink>{" "}
                                              (played by{" "}
                                              <TypographyLink
                                                href={`/players/${character.player.username}`}
                                                target="_blank"
                                                variant="default"
                                              >
                                                {character.player.name}
                                              </TypographyLink>
                                              )
                                            </span>
                                            <Check
                                              className={cn(
                                                "ml-auto",
                                                character.id === field.value ? "opacity-100" : "opacity-0",
                                              )}
                                            />
                                          </CommandItem>
                                        ),
                                    )}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                          <DialogFooter>
                            <div className="w-full flex flex-row justify-end">
                              <Button
                                type="button"
                                variant="outline"
                                size="default"
                                className="mt-2 space-x-1 items-center w-fit"
                                onClick={() => {
                                  charactersAppend({ id: field.value ?? "" });
                                  setCharactersDialogOpen(false);
                                  form.setValue("selectedCharacter", "");
                                }}
                                disabled={pending || form.getValues("characters").length === characters.length}
                              >
                                Add
                              </Button>
                            </div>
                          </DialogFooter>
                        </FormItem>
                      )}
                    />
                  </DialogContent>
                </Dialog>
              </div>
              <SheetFooter className="flex sm:flex-row sm:justify-between items-end w-full gap-2">
                <Button type="reset" variant="ghost" size="icon" disabled={pending} onClick={() => form.reset()}>
                  <RefreshCcw />
                </Button>
                <div className="flex flex-row gap-2 items-center sm:w-fit w-full">
                  <SheetClose asChild className="sm:w-fit w-full">
                    <Button variant="outline" disabled={pending}>
                      Close
                    </Button>
                  </SheetClose>
                  <Button type="submit" disabled={pending} className="sm:w-fit w-full">
                    Submit
                  </Button>
                </div>
              </SheetFooter>
            </form>
          </Form>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
