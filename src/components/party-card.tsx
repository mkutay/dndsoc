"use client";

import { MinusCircle } from "lucide-react";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { TypographyParagraph } from "@/components/typography/paragraph";
import { Tables } from "@/types/database.types";
import { truncateText } from "@/utils/formatting";

type Party = Tables<"parties">;

type Props = {
  party: Party;
  ownsDM: boolean;
  onRemove: () => void;
  isLoading: boolean;
  removeText?: string;
} | {
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
        <TypographyParagraph>
          {truncateText(party.about, 100)}
        </TypographyParagraph>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href={`/parties/${party.shortened}`}>
            View {party.name}
          </Link>
        </Button>
        {'ownsDM' in props && props.ownsDM && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={props.onRemove}
                  disabled={props.isLoading}
                >
                  <MinusCircle size="18px" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <TypographyParagraph>
                  {props.removeText ? props.removeText : "Remove this party."}
                </TypographyParagraph>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </CardFooter>
    </Card>
  );
}