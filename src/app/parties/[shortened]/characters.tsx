import Link from "next/link";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TypographyParagraph } from "@/components/typography/paragraph";
import { TypographyH2 } from "@/components/typography/headings";
import { Tables } from "@/types/database.types";

export function Characters({ characters }: { characters: Tables<"characters">[] }) {
  if (characters.length === 0) return null;

  return (
    <div className="mt-8">
      <TypographyH2>Characters</TypographyH2>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 mt-6">
        {characters.map((character, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{character.name}</CardTitle>
              <CardDescription>
                Level: {character.level}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TypographyParagraph>
                {character.about || "No about."}
              </TypographyParagraph>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild>
                <Link href={`/characters/${character.shortened}`}>
                  View {character.name}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}