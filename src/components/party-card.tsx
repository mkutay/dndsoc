"use client";

import { MinusCircle } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { TypographyParagraph } from "@/components/typography/paragraph";
import { type Tables } from "@/types/database.types";
import { truncateText } from "@/utils/formatting";

type Party = Tables<"parties">;

type Props =
  | {
      party: Party;
      onRemove: () => void;
      isLoading: boolean;
      removeText?: string;
    }
  | {
      party: Party;
    };

export function PartyCard(props: Props) {
  const { party } = props;
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{party.name}</CardTitle>
        <CardDescription>Level {party.level}</CardDescription>
      </CardHeader>
      <CardContent>
        <TypographyParagraph>{truncateText(party.about, 100)}</TypographyParagraph>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" asChild size="sm">
          <Link href={`/parties/${party.shortened}`}>View Party</Link>
        </Button>
        {"onRemove" in props ? (
          <div className="flex items-center flex-row gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="destructive" size="smIcon" onClick={props.onRemove} disabled={props.isLoading}>
                    <MinusCircle size="18px" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <TypographyParagraph>{props.removeText ?? "Remove this party."}</TypographyParagraph>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ) : null}
      </CardFooter>
    </Card>
  );
}
