import Link from "next/link";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TypographyParagraph } from "@/components/typography/paragraph";
import { TypographyH1 } from "@/components/typography/headings";
import { Button } from "@/components/ui/button";
import { ErrorPage } from "@/components/error-page";
import { getParties } from "@/lib/parties";

export const dynamic = "force-dynamic";

export default async function Page() {
  const result = await getParties();
  if (result.isErr()) {
    return <ErrorPage error={result.error} caller="/players page" />;
  }
  const parties = result.value;

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose my-12 px-4">
      <TypographyH1>Parties</TypographyH1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        {parties.map((party, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{party.name}</CardTitle>
              <CardDescription>Level {party.level}</CardDescription>
            </CardHeader>
            <CardContent>
              <TypographyParagraph>
                {party.about || "No about available."}
              </TypographyParagraph>
            </CardContent>
            <CardFooter className="flex flex-row justify-end">
              <Button asChild size="sm" variant="default">
                <Link href={`/parties/${party.shortened}`}>
                  View Party
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}