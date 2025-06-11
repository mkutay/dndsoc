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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TypographyLink } from "@/components/typography/paragraph";
import { TypographyH2 } from "@/components/typography/headings";
import { CampaignCard } from "@/components/campaign-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tables } from "@/types/database.types";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { addCampaignToParty, removeCampaignFromParty } from "@/server/campaigns";

type Campaign = Tables<"campaigns">;

type CampaignAction =
  | { type: "add"; campaign: Campaign }
  | { type: "remove"; campaignId: string };

export const addCampaignForPartySchema = z.object({
  campaign: z.string().optional(),
});

export function Campaigns({
  campaigns,
  ownsAs,
  partyId,
  allCampaigns,
}: {
  campaigns: Campaign[];
  ownsAs: "dm" | "player" | "admin" | null;
  partyId: string;
  allCampaigns?: Campaign[];
}) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [optimisticCampaigns, updateOptimisticCampaigns] = useOptimistic(
    campaigns,
    (state, action: CampaignAction) => {
      switch (action.type) {
        case "add":
          return [...state, action.campaign];
        case "remove":
          return state.filter((c) => c.id !== action.campaignId);
      }
    }
  );

  // Sort campaigns by date
  const sortedCampaigns = optimisticCampaigns.sort((a, b) => {
    const dateA = new Date(a.start_date);
    const dateB = new Date(b.start_date);
    return dateB.getTime() - dateA.getTime();
  });

  const handleRemoveCampaign = (campaign: Campaign) => 
    startTransition(async () => {
      updateOptimisticCampaigns({ type: "remove", campaignId: campaign.id });

      const result = await removeCampaignFromParty({
        campaignId: campaign.id,
        partyId,
        shortened: campaign.shortened,
      });

      if (!result.ok) {
        toast({
          title: "Could Not Remove Campaign",
          description: result.error.message,
          variant: "destructive",
        });
      }
    });

  const handleAddCampaign = (campaign: Campaign) => 
    startTransition(async () => {
      updateOptimisticCampaigns({ type: "add", campaign });

      const result = await addCampaignToParty({
        campaignId: campaign.id,
        partyId,
        shortened: campaign.shortened,
      });

      if (!result.ok) {
        toast({
          title: "Add Campaign Failed",
          description: result.error.message,
          variant: "destructive",
        })
      }
    });

  const availableCampaigns =
    allCampaigns?.filter(
      (campaign) => !optimisticCampaigns.some((c) => c.id === campaign.id)
    ) ?? [];

  return (
    <div className="mt-6 flex flex-col">
      <TypographyH2>Campaigns</TypographyH2>
      <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 mt-6">
        {sortedCampaigns.map((campaign) => (
          <CampaignCard
            key={campaign.id}
            campaign={campaign}
            ownsAs={ownsAs}
            onRemove={() => handleRemoveCampaign(campaign)}
            isLoading={isPending}
            removeText="Remove this campaign from the party. You can add it later."
          />
        ))}
        {ownsAs === "admin" && availableCampaigns.length > 0 && (
          <AddCampaignCard
            campaigns={availableCampaigns}
            onAdd={handleAddCampaign}
            isLoading={isPending}
          />
        )}
      </div>
    </div>
  );
}

function AddCampaignCard({
  campaigns,
  onAdd,
  isLoading,
}: {
  campaigns: Campaign[];
  onAdd: (campaign: Campaign) => void;
  isLoading: boolean;
}) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof addCampaignForPartySchema>>({
    resolver: zodResolver(addCampaignForPartySchema),
    defaultValues: {
      campaign: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof addCampaignForPartySchema>) => {
    if (!values.campaign) return;

    const campaign = campaigns.find((c) => c.id === values.campaign);
    if (campaign) {
      onAdd(campaign);
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
          <Card className="text-3xl font-book-card-titles tracking-widest">
            Add Campaign
          </Card>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Campaign</DialogTitle>
          <DialogDescription>
            You can select a new campaign to add to your party.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              name="campaign"
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
                                  form.setValue("campaign", campaign.id);
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
                  disabled={isLoading}
                >
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