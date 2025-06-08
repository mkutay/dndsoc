"use client";

import Link from "next/link";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { TypographyParagraph } from "./typography/paragraph";
import { Character } from "@/types/full-database.types";
import { Button } from "./ui/button";
import { MinusCircle } from "lucide-react";

type Props = {
  character: Character;
  ownsAs: "dm" | "player" | "admin" | null;
  onRemove: () => void;
  isLoading: boolean;
  removeText?: string;
} | {
  character: Character;
};

export function CharacterCard(props: Props) {
  const { character } = props;

  const truncatedAbout =
    character.about && character.about.length > 100
      ? character.about.substring(0, 100) + "..."
      : character.about;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{character.name}</CardTitle>
        <CardDescription>
          Level {character.level}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TypographyParagraph>
          {truncatedAbout}
        </TypographyParagraph>
      </CardContent>
      <CardFooter className="flex flex-row justify-end gap-2 flex-wrap">
        <Button asChild size="sm" variant="outline">
          <Link href={`/players/${character.players.users.username}`} className="text-sm tracking-wide">
            Played By {character.players.users.name}
          </Link>
        </Button>
        <Button asChild size="sm">
          <Link href={`/characters/${character.shortened}`} className="text-sm tracking-wide">
            View Character
          </Link>
        </Button>
        {'ownsAs' in props && (props.ownsAs === "dm" || props.ownsAs === "admin") && (
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
                  {props.removeText ? props.removeText : "Remove this character."}
                </TypographyParagraph>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </CardFooter>
    </Card>
  )
}