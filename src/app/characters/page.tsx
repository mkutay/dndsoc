import { ErrorPage } from "@/components/error-page";
import { TypographyH1 } from "@/components/typography/headings";
import { TypographyParagraph } from "@/components/typography/paragraph";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getCharacters } from "@/lib/characters/query-all";
import Link from "next/link";

export default async function Page() {
  const characters = await getCharacters();
  if (!characters.isOk()) return <ErrorPage error={characters.error.message} />;
  console.log(characters);

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose my-12 px-4">
      <TypographyH1>Characters</TypographyH1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        {characters.value.map((character, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{character.name}</CardTitle>
              <CardDescription>
                Level {character.level}{character.players ? ` | Played by ${character.players.users.username}` : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TypographyParagraph>
                {character.about || "No about available."}
              </TypographyParagraph>
            </CardContent>
            <CardFooter className="flex flex-row justify-end">
              <Button asChild size="sm" variant="outline">
                <Link href={`/characters/${character.shortened}`}>
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