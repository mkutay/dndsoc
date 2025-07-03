"use client";

import { MinusCircle } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { TypographyParagraph } from "./typography/paragraph";
import { Button } from "./ui/button";
import { type Tables } from "@/types/database.types";

type Campaign = Tables<"campaigns">;

type Props =
  | {
      campaign: Campaign;
      ownsAs: "dm" | "player" | "admin" | null;
      onRemove: () => void;
      isLoading: boolean;
      removeText?: string;
    }
  | {
      campaign: Campaign;
    };

export function CampaignCard(props: Props) {
  const { campaign } = props;
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{campaign.name}</CardTitle>
        <CardDescription>
          {format(campaign.start_date, "PP")} - {campaign.end_date ? format(campaign.end_date, "PP") : "Ongoing"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TypographyParagraph>{campaign.description}</TypographyParagraph>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href={`/campaigns/${campaign.shortened}`}>View {campaign.name}</Link>
        </Button>
        {"ownsAs" in props && props.ownsAs === "admin" && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="destructive" size="icon" onClick={props.onRemove} disabled={props.isLoading}>
                  <MinusCircle size="18px" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <TypographyParagraph>{props.removeText ?? "Remove this campaign."}</TypographyParagraph>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </CardFooter>
    </Card>
  );
}
