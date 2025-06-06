import { Metadata } from "next";
import Link from "next/link";

import { ErrorPage } from "@/components/error-page";
import { TypographyH1 } from "@/components/typography/headings";
import { TypographyParagraph } from "@/components/typography/paragraph";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import DB from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "All of Characters In Our Society",
  description: "List of all of the characters that are in the world of our campaigns.",
  openGraph: {
    title: "All of Characters In Our Society",
    description: "List of all of the characters that are in the world of our campaigns.",
  },
};

export default async function Page() {
  const characters = await DB.Characters.Get.All();
  if (characters.isErr()) return <ErrorPage error={characters.error} caller="/characters/page.tsx" />;

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      <TypographyH1>Characters</TypographyH1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {characters.value.map((character, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{character.name}</CardTitle>
              <CardDescription>
                Level {character.level}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TypographyParagraph>
                {character.about && character.about.length > 100 
                  ? character.about.substring(0, 100) + "..."
                  : character.about || "No about available."}
              </TypographyParagraph>
            </CardContent>
            <CardFooter className="flex flex-row justify-end gap-2 flex-wrap">
              <Button asChild size="sm" variant="outline">
                <Link href={`/players/${character.players.users.username}`} className="text-sm tracking-wide">
                  Played By {firstUp(character.players.users.name)}
                </Link>
              </Button>
              <Button asChild size="sm">
                <Link href={`/characters/${character.shortened}`} className="text-sm tracking-wide">
                  View Character
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

function firstUp(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}