"use client";

import { Check, ChevronsUpDown, MinusCircle } from "lucide-react";
import { startTransition, useOptimistic, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import Link from "next/link";
import { z } from "zod";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { TypographyLink, TypographyParagraph } from "@/components/typography/paragraph";
import { TypographyH2 } from "@/components/typography/headings";
import { Tables } from "@/types/database.types";
import Server from "@/server/server";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type Campaign = Tables<"campaigns">;

export function Campaigns({
  campaigns,
  ownsAs,
  partyId,
  allCampaigns
}: {
  campaigns: Campaign[]; // campaigns that are already in the party
  ownsAs: "dm" | "player" | "admin" | null;
  partyId: string;
  allCampaigns?: Campaign[]; // all campaigns, including those not in the party
}) {
  const { toast } = useToast();

  const [optimisticCampaigns, setOptimisticCampaigns] = useOptimistic(
    campaigns,
    (currentState, action: {
      type: "add"; campaign: Campaign;
    } | {
      type: "remove"; campaignId: string;
    }) => action.type === "add"
      ? [...currentState, action.campaign]
      : currentState.filter((campaign) => campaign.id !== action.campaignId),
  );

  // sort by start date
  optimisticCampaigns.sort((a, b) => {
    const dateA = new Date(a.start_date);
    const dateB = new Date(b.start_date);
    return dateA.getTime() - dateB.getTime();
  });
  optimisticCampaigns.reverse();

  const onSubmit = async (campaign: Campaign) => {
    setOptimisticCampaigns({
      type: "remove",
      campaignId: campaign.id,
    });
    const result = await Server.Campaigns.Remove.Party({ campaignId: campaign.id, partyId, shortened: campaign.shortened });
    if (!result.ok) {
      toast({
        title: "Could Not Remove Campaign",
        description: result.error.message,
        variant: "destructive",
      });
      setOptimisticCampaigns({
        type: "add",
        campaign,
      });
    }
  };

  return (
    <div className="mt-6 flex flex-col">
      <TypographyH2>Campaigns</TypographyH2>
      <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 mt-6">
        {optimisticCampaigns.map((campaign, index) => (
          <Card key={index} className="w-full">
            <CardHeader>
              <CardTitle>{campaign.name}</CardTitle>
              <CardDescription>
                {format(campaign.start_date, "PP")} - {campaign.end_date ? format(campaign.end_date, "PP") : "Ongoing"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TypographyParagraph>
                {campaign.description}
              </TypographyParagraph>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href={`/campaigns/${campaign.shortened}`}>
                  View {campaign.name}
                </Link>
              </Button>
                {ownsAs === "admin" && (
                  <form
                    action={async () => { await onSubmit(campaign); }}
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="destructive" size="icon" type="submit">
                            <MinusCircle size="18px" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <TypographyParagraph>Remove this campaign from the party. You can add it later.</TypographyParagraph>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </form>
                )}
            </CardFooter>
          </Card>
        ))}
        {ownsAs === "admin" && allCampaigns && <AddCampaign
          campaigns={allCampaigns.filter((campaign) => !optimisticCampaigns.some((c) => c.id === campaign.id))}
          partyUuid={partyId}
          setOptimisticCampaigns={setOptimisticCampaigns}
        />}
      </div>
    </div>
  )
}

export const addCampaignForPartySchema = z.object({
  campaign: z.string().optional(),
});

function AddCampaign({
  campaigns,
  partyUuid,
  setOptimisticCampaigns,
}: {
  campaigns: Campaign[];
  partyUuid: string;
  setOptimisticCampaigns: (action: {
    type: "add";
    campaign: Campaign;
  } | {
    type: "remove";
    campaignId: string;
  }) => void;
}) {
  const { toast } = useToast();
  const [pending, setPending] = useState(false);
  const [open, setOpen] = useState(false);
  
  const form = useForm<z.infer<typeof addCampaignForPartySchema>>({
    resolver: zodResolver(addCampaignForPartySchema),
    defaultValues: {
      campaign: "",
    },
  });

  if (campaigns.length === 0) return null;
 
  const onSubmit = async (values: z.infer<typeof addCampaignForPartySchema>) => {
    if (!values.campaign) return;

    const campaignToAdd = campaigns.find((campaign) => campaign.id === values.campaign)!;
    startTransition(() =>
      setOptimisticCampaigns({
        type: "add",
        campaign: campaignToAdd,
      })
    );
    setPending(true);
    setOpen(false);

    const result = await Server.Parties.Add.Campaign({ campaignId: values.campaign, partyId: partyUuid, shortened: campaignToAdd.shortened });

    setPending(false);

    if (!result.ok) {
      toast({
        title: "Add Campaign Failed",
        description: "Please try again. " + result.error.message,
        variant: "destructive",
      });
      startTransition(() =>
        setOptimisticCampaigns({
          type: "remove",
          campaignId: values.campaign || "",
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
          <form onSubmit={form.handleSubmit(onSubmit)}>
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
                                  form.setValue("campaign", campaign.id)
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