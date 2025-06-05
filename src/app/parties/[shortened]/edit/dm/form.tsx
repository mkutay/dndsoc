"use client"

import { Check, ChevronsUpDown, MinusIcon, PlusIcon } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TypographyLink } from "@/components/typography/paragraph";
import { partyDMEditSchema } from "@/config/parties";
import { useToast } from "@/hooks/use-toast";
import { actionResultMatch } from "@/types/error-typing";
import { cn } from "@/lib/utils";
import Server from "@/server/server";

type Campaign = {
  description: string;
  end_date: string | null;
  id: string;
  name: string;
  shortened: string;
  start_date: string;
};

type Character = {
  about: string;
  id: string;
  level: number;
  name: string;
  player_uuid: string | null;
  shortened: string;
};

type CharacterPlayer = Character & {
  players: {
    about: string;
    id: string;
    level: number;
    username: string;
    name: string;
  };
};

type DM = {
  id: string;
  username: string;
  about: string;
  level: number;
  name: string;
};

export function DMForm({
  about,
  level,
  name,
  currentCharacters,
  currentCampaigns,
  currentDMs,
  characters,
  campaigns,
  DMs,
  partyUuid,
  thisDMUuid,
}: {
  about: string;
  level: number;
  name: string;
  currentCharacters: Character[];
  currentCampaigns: Campaign[];
  currentDMs: DM[];
  characters: CharacterPlayer[];
  campaigns: Campaign[];
  DMs: DM[];
  partyUuid: string;
  thisDMUuid: string | undefined; // undefined when admin
}) {
  const { toast } = useToast();
  const [pending, setPending] = useState(false);
  const [charactersDialogOpen, setCharactersDialogOpen] = useState(false);
  const [campaignsDialogOpen, setCampaignsDialogOpen] = useState(false);
  const [DMsDialogOpen, setDMsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof partyDMEditSchema>>({
    resolver: zodResolver(partyDMEditSchema),
    defaultValues: {
      about,
      level,
      name,
      characters: currentCharacters.map((character) => ({
        id: character.id,
      })),
      campaigns: currentCampaigns.map((campaign) => ({
        id: campaign.id,
      })),
      dms: currentDMs.map((dm) => ({
        id: dm.id,
      })),
      selectedCharacter: "",
      selectedCampaign: "",
      selectedDM: "",
    },
  });

  const { fields: charactersFields, append: charactersAppend, remove: charactersRemove } = useFieldArray({
    control: form.control,
    name: "characters",
  });

  const { fields: campaignsFields, append: campaignsAppend, remove: campaignsRemove } = useFieldArray({
    control: form.control,
    name: "campaigns",
  });

  const { fields: dmsFields, append: dmsAppend, remove: dmsRemove } = useFieldArray({
    control: form.control,
    name: "dms",
  });
 
  const onSubmit = async (values: z.infer<typeof partyDMEditSchema>) => {
    setPending(true);
    const result = await Server.Parties.Update.DM(values, partyUuid);
    setPending(false);

    actionResultMatch(
      result,
      () => 
        toast({
          title: "Update Successful",
          description: "Your party has been updated.",
        }),
      (error) => 
        toast({
          title: "Update Failed",
          description: "Please try again. " + error.message,
          variant: "destructive",
        })
    )
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-prose mt-6">
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
              <FormDescription>
                This is your party&apos;s name.
              </FormDescription>
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
                <Input 
                  placeholder="1"
                  {...field} 
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only allow empty input or valid numbers
                    if (value === '' || /^\d+$/.test(value)) {
                      field.onChange(value === '' ? '' : Number(value));
                    }
                  }}
                  value={field.value}
                />
              </FormControl>
              <FormDescription>
                This is your party&apos;s level.
              </FormDescription>
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
              <FormDescription>
                This is your party&apos;s public about.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
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
                      <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm">
                        {!field.value && "Select a character..."}
                        {field.value && (() => {
                          const character = characters.find((char) => field.value.id === char.id);
                          return character ? (
                            <span>
                              <TypographyLink target="_blank" href={`/characters/${character.shortened}`} variant="default">{character.name}</TypographyLink> (played by <TypographyLink 
                                href={`/players/${character.players.username}`} 
                                target="_blank"
                                variant="default">
                                {character.players.name}
                              </TypographyLink>)
                            </span>
                          ) : null;
                        })()}
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full flex-shrink-0"
                        onClick={() => {
                          charactersRemove(index);
                        }}
                        disabled={charactersFields.length <= 1 || pending}
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
              <Button
                variant="outline"
                size="sm"
                className="mt-2 space-x-1 items-center"
                disabled={pending}
              ><PlusIcon size="18px" /><span>Add Character</span></Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Character</DialogTitle>
                <DialogDescription>
                  You can add a new character to your party.
                </DialogDescription>
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
                            className={cn(
                              "w-[250px] justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {!field.value && "Select a character..."}
                            {field.value && (() => {
                              const character = characters.find((char) => field.value === char.id);
                              return character ? (
                                <span>
                                  <TypographyLink target="_blank" href={`/characters/${character.shortened}`} variant="default">{character.name}</TypographyLink> (played by <TypographyLink 
                                    href={`/players/${character.players.username}`} 
                                    target="_blank"
                                    variant="default">
                                    {character.players.name}
                                  </TypographyLink>)
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
                            <CommandEmpty>No other character found.</CommandEmpty>
                            <CommandGroup>
                              {characters.map((character) => !form.getValues("characters").some(
                                  (selectedChar) => selectedChar.id === character.id
                                ) && (
                                <CommandItem
                                  value={character.name}
                                  key={character.id}
                                  onSelect={() => {
                                    form.setValue("selectedCharacter", character.id)
                                  }}
                                >
                                  <span>
                                    <TypographyLink target="_blank" href={`/characters/${character.shortened}`} variant="default">{character.name}</TypographyLink> (played by <TypographyLink
                                      href={`/players/${character.players.username}`}
                                      target="_blank"
                                      variant="default">
                                        {character.players.name}</TypographyLink>)
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
                    <DialogFooter>
                      <div className="w-full flex flex-row justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="default"
                          className="mt-2 space-x-1 items-center w-fit"
                          onClick={() => {
                            charactersAppend({ id: field.value || "" });
                            setCharactersDialogOpen(false);
                            form.setValue("selectedCharacter", "");
                          }}
                          disabled={pending || form.getValues("characters").length === characters.length}
                        >Add</Button>
                      </div>
                    </DialogFooter>
                  </FormItem>
                )}
              />
            </DialogContent>
          </Dialog>
        </div>
        <div>
          {campaignsFields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`campaigns.${index}`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(index !== 0 ? "hidden" : "flex")}>Campaigns</FormLabel>
                  <FormControl>
                    <div className="relative w-full items-center">
                      <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm">
                        {!field.value && "Select a character..."}
                        {field.value && (() => {
                          const campaign = campaigns.find((campaign) => field.value.id === campaign.id);
                          return campaign ? (
                            <span>
                              <TypographyLink target="_blank" href={`/campaigns/${campaign.shortened}`} variant="default">{campaign.name}</TypographyLink>
                            </span>
                          ) : null;
                        })()}
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full flex-shrink-0"
                        onClick={() => {
                          campaignsRemove(index);
                        }}
                        disabled={campaignsFields.length <= 1 || pending}
                      >
                        <MinusIcon size={14} />
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription className={cn(index !== campaignsFields.length - 1 ? "hidden" : "flex")}>
                    These are the campaigns that your party is playing (or has played).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Dialog open={campaignsDialogOpen} onOpenChange={setCampaignsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 space-x-1 items-center"
                disabled={pending}
              ><PlusIcon size="18px" /><span>Add Campaign</span></Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Campaign</DialogTitle>
                <DialogDescription>
                  You can select a new campaign to add to your party.
                </DialogDescription>
              </DialogHeader>
              <FormField
                control={form.control}
                name="selectedCampaign"
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
                            {!field.value && "Select a campaign..."}
                            {field.value && (() => {
                              const campaign = campaigns.find((campaign) => field.value === campaign.id);
                              return campaign ? (
                                <span>
                                  <TypographyLink target="_blank" href={`/campaigns/${campaign.shortened}`} variant="default">{campaign.name}</TypographyLink>
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
                            placeholder="Search a DM..."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>No other campaign found.</CommandEmpty>
                            <CommandGroup>
                              {campaigns.map((campaign) => !form.getValues("campaigns").some(
                                  (selectedCampaign) => selectedCampaign.id === campaign.id
                                ) && (
                                <CommandItem
                                  value={campaign.name}
                                  key={campaign.id}
                                  onSelect={() => {
                                    form.setValue("selectedCampaign", campaign.id)
                                  }}
                                >
                                  <span>
                                    <TypographyLink target="_blank" href={`/campaigns/${campaign.shortened}`} variant="default">{campaign.name}</TypographyLink>
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
                    <FormMessage />
                    <DialogFooter>
                      <div className="w-full flex flex-row justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="default"
                          className="mt-2 space-x-1 items-center w-fit"
                          onClick={() => {
                            campaignsAppend({ id: field.value || "" });
                            setCampaignsDialogOpen(false);
                            form.setValue("selectedCampaign", "");
                          }}
                          disabled={pending || form.getValues("campaigns").length === campaigns.length}
                        >Add</Button>
                      </div>
                    </DialogFooter>
                  </FormItem>
                )}
              />
            </DialogContent>
          </Dialog>
        </div>
        <div>
          {dmsFields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`dms.${index}`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(index !== 0 ? "hidden" : "flex")}>DMs</FormLabel>
                  <FormControl>
                    <div className="relative w-full items-center">
                      <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm">
                        {!field.value && "Select a DM..."}
                        {field.value && (() => {
                          const dm = DMs.find((dm) => field.value.id === dm.id);
                          return dm ? (
                            <span>
                              <TypographyLink target="_blank" href={`/dms/${dm.username}`} variant="default">{dm.name}</TypographyLink>
                            </span>
                          ) : null;
                        })()}
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full flex-shrink-0"
                        onClick={() => {
                          dmsRemove(index);
                        }}
                        disabled={dmsFields.length <= 1 || pending || thisDMUuid === field.value.id}
                      >
                        <MinusIcon size={14} />
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription className={cn(index !== dmsFields.length - 1 ? "hidden" : "flex")}>
                    These are the DMs that is hosting your party.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Dialog open={DMsDialogOpen} onOpenChange={setDMsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 space-x-1 items-center"
                disabled={pending}
              ><PlusIcon size="18px" /><span>Add DM</span></Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add DM</DialogTitle>
                <DialogDescription>
                  You can select a DM to add to your party.
                </DialogDescription>
              </DialogHeader>
              <FormField
                control={form.control}
                name="selectedDM"
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
                            {!field.value && "Select a DM..."}
                            {field.value && (() => {
                              const dm = DMs.find((dm) => field.value === dm.id);
                              return dm ? (
                                <span>
                                  <TypographyLink target="_blank" href={`/dms/${dm.username}`} variant="default">{dm.name}</TypographyLink>
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
                            <CommandEmpty>No other DM found.</CommandEmpty>
                            <CommandGroup>
                              {DMs.map((dm) => !form.getValues("dms").some(
                                  (selectedDM) => selectedDM.id === dm.id
                                ) && (
                                <CommandItem
                                  value={dm.name}
                                  key={dm.id}
                                  onSelect={() => {
                                    form.setValue("selectedDM", dm.id)
                                  }}
                                >
                                  <span>
                                    <TypographyLink target="_blank" href={`/dms/${dm.username}`} variant="default">{dm.name}</TypographyLink>
                                  </span>
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      dm.id === field.value
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
                    <DialogFooter>
                      <div className="w-full flex flex-row justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="default"
                          className="mt-2 space-x-1 items-center w-fit"
                          onClick={() => {
                            dmsAppend({ id: field.value || "" });
                            setDMsDialogOpen(false);
                            form.setValue("selectedDM", "");
                          }}
                          disabled={pending || form.getValues("dms").length === DMs.length}
                        >Add</Button>
                      </div>
                    </DialogFooter>
                  </FormItem>
                )}
              />
            </DialogContent>
          </Dialog>
        </div>
        <Button type="submit" disabled={pending}>Submit</Button>
      </form>
    </Form>
  )
}