import { GiCrossedSwords } from "react-icons/gi";
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
import { type Tables } from "@/types/database.types";
import { formatList, truncateText } from "@/utils/formatting";
import { AddCharacterForm } from "@/components/players/add-character-form";

export function MyCharacters({
  characters,
  playerId,
}: {
  characters: (Tables<"characters"> & {
    races: Tables<"races">[];
    classes: Tables<"classes">[];
  })[];
  playerId: string;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <GiCrossedSwords size={36} />
        <h3 className="scroll-m-20 sm:text-3xl text-2xl font-semibold tracking-tight font-headings">
          Your Characters ({characters.length})
        </h3>
      </div>
      {characters.length === 0 && (
        <TypographyParagraph className="text-muted-foreground">
          You don&apos;t have any characters yet. Create your first character to start adventuring!
        </TypographyParagraph>
      )}
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
                    {character.classes.length > 0 && formatList(character.classes)}
                    {character.classes.length > 0 && character.races.length > 0 && " · "}
                    {character.races.length > 0 && formatList(character.races)}
                  </>
                )}
              </CardDescription>
            </CardHeader>
            {character.about ? (
              <CardContent>
                <TypographyParagraph>{truncateText(character.about, 100)}</TypographyParagraph>
              </CardContent>
            ) : null}
            <CardFooter className="flex gap-2 justify-end">
              <Button asChild size="sm" variant="outline">
                <Link href={`/characters/${character.shortened}`}>View Character</Link>
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
              <Card className="text-3xl font-book-card-titles tracking-widest">Create Character</Card>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Character</DialogTitle>
              <DialogDescription>You can add a new character to your player.</DialogDescription>
            </DialogHeader>
            <AddCharacterForm playerUuid={playerId} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
