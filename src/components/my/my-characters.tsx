import { Sword } from "lucide-react";
import Link from "next/link";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TypographyParagraph } from "@/components/typography/paragraph";
import { Tables } from "@/types/database.types";
import { formatClasses, formatRaces, truncateText } from "@/utils/formatting";
import { AddCharacterForm } from "../players/add-character-form";

interface MyCharactersProps {
  characters: (Tables<"characters"> & {
    races: Tables<"races">[];
    classes: Tables<"classes">[];
    players: Tables<"players">;
  })[];
}

export function MyCharacters({ characters }: MyCharactersProps) {
  if (characters.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sword size={20} />
            Your Characters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TypographyParagraph className="text-muted-foreground">
            You haven&apos;t created any characters yet. Create your first character to start playing!
          </TypographyParagraph>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sword size={20} />
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight font-headings">
          Your Characters ({characters.length})
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {characters.map((character) => (
          <Card key={character.id}>
            <CardHeader>
              <CardTitle>{character.name}</CardTitle>
              <CardDescription>
                Level {character.level}
                {(character.classes.length > 0 || character.races.length > 0) && (
                  <>
                    {" · "}
                    {character.classes.length > 0 && formatClasses(character.classes)}
                    {character.classes.length > 0 && character.races.length > 0 && " · "}
                    {character.races.length > 0 && formatRaces(character.races)}
                  </>
                )}
              </CardDescription>
            </CardHeader>
            {character.about && (
              <CardContent>
                <TypographyParagraph className="text-sm">
                  {truncateText(character.about, 100)}
                </TypographyParagraph>
              </CardContent>
            )}
            <CardFooter className="flex gap-2">
              <Button asChild size="sm">
                <Link href={`/characters/${character.shortened}`}>
                  View Character
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href={`/characters/${character.shortened}/edit`}>
                  Edit
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="nothing"
              type="button"
              className="w-full h-full rounded-lg hover:bg-card/80 bg-card min-h-60"
              asChild
            >
              <Card className="text-3xl font-book-card-titles tracking-widest">
                Create Character
              </Card>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Character</DialogTitle>
              <DialogDescription>
                You can add a new character to your player.
              </DialogDescription>
            </DialogHeader>
            <AddCharacterForm playerUuid={characters[0].players.id} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
