"use client";

import Link from "next/link";

import { MinusCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { TypographyParagraph } from "./typography/paragraph";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { type Character } from "@/types/full-database.types";
import { truncateText } from "@/utils/formatting";

type Props =
  | {
      character: Character;
      ownsAs: "dm" | "player" | "admin" | null;
      onRemove: () => void;
      isLoading: boolean;
      removeText?: string;
    }
  | {
      character: Character;
    };

export function CharacterCard(props: Props) {
  const { character } = props;

  const truncatedAbout = truncateText(character.about, 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{character.name}</CardTitle>
        <CardDescription>Level {character.level}</CardDescription>
      </CardHeader>
      <CardContent>
        <TypographyParagraph>{truncatedAbout}</TypographyParagraph>
      </CardContent>
      <CardFooter className="flex flex-row justify-end gap-2 flex-wrap">
        <Button asChild size="sm" variant="outline">
          <Link href={`/characters/${character.shortened}`} className="text-sm tracking-wide">
            View Character
          </Link>
        </Button>
        {"ownsAs" in props && (props.ownsAs === "dm" || props.ownsAs === "admin") && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="destructive" size="icon" onClick={props.onRemove} disabled={props.isLoading}>
                  <MinusCircle size="18px" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <TypographyParagraph>{props.removeText ?? "Remove this character."}</TypographyParagraph>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </CardFooter>
    </Card>
  );
}
