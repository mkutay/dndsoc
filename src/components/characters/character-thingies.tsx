import Link from "next/link";

import { AddThingy } from "./add-thingy";
import { Button } from "@/components/ui/button";
import { runQuery } from "@/utils/supabase-run";
import { ErrorPage } from "@/components/error-page";
import { TypographyH2 } from "@/components/typography/headings";
import { TypographyParagraph } from "@/components/typography/paragraph";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export async function CharacterThingies({
  ownsCharacter,
  characterUuid,
}: {
  ownsCharacter: boolean;
  characterUuid: string;
}) {
  const result = await get(ownsCharacter, characterUuid);
  if (result.isErr()) {
    return <ErrorPage error={result.error} caller="character-thingies.tsx" />;
  }

  if (result.value.length === 0 && !ownsCharacter) return null;

  return (
    <div className="mt-6">
      <TypographyH2>Character Thingies</TypographyH2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        {result.value.map((thingy) => (
          <Card key={thingy.shortened}>
            <CardHeader>
              <CardTitle>{thingy.name}</CardTitle>
              {!thingy.public ? <CardDescription className="font-quotes">Not Public</CardDescription> : null}
            </CardHeader>
            <CardContent>
              <TypographyParagraph>{thingy.description}</TypographyParagraph>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" size="sm">
                <Link href={`/thingies/${thingy.shortened}`}>View Thingy</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
        {ownsCharacter ? <AddThingy characterUuid={characterUuid} /> : null}
      </div>
    </div>
  );
}

const get = (ownsCharacter: boolean, characterUuid: string) =>
  ownsCharacter
    ? runQuery(
        (supabase) => supabase.from("thingy").select("*").eq("character_id", characterUuid).is("next", null),
        "GET_THINGIES",
      )
    : runQuery(
        (supabase) =>
          supabase.from("thingy").select("*").eq("character_id", characterUuid).eq("public", true).is("next", null),
        "GET_PUBLIC_THINGIES",
      );
