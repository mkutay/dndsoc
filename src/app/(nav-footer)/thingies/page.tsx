import { type Metadata } from "next";
import Link from "next/link";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TypographyH1 } from "@/components/typography/headings";
import { Button } from "@/components/ui/button";
import { ErrorPage } from "@/components/error-page";
import { runQuery } from "@/utils/supabase-run";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "All of the Thingies",
  description: "List of all of the thingies in the KCL Dungeons and Dragons app.",
  openGraph: {
    title: "All of the Thingies",
    description: "List of all of the thingies in the KCL Dungeons and Dragons app.",
  },
};

export default async function Page() {
  const thingies = await runQuery((supabase) => supabase.from("thingy").select("*").is("next", null), "GET_THINGIES");
  if (thingies.isErr()) return <ErrorPage error={thingies.error} caller="/thingies/page.tsx" />;

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      <TypographyH1>Thingies</TypographyH1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {thingies.value.map((thingy) => (
          <Card key={thingy.shortened}>
            <CardHeader>
              <CardTitle>{thingy.name}</CardTitle>
              {!thingy.public && <CardDescription className="font-quotes">Not Public</CardDescription>}
            </CardHeader>
            <CardContent className="line-clamp-3">{thingy.description}</CardContent>
            <CardFooter className="flex flex-row justify-end">
              <Button asChild size="sm" variant="default">
                <Link href={`/thingies/${thingy.shortened}`}>View</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
