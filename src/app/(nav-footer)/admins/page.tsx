import { type Metadata } from "next";
import Link from "next/link";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TypographyParagraph } from "@/components/typography/paragraph";
import { TypographyH1 } from "@/components/typography/headings";
import { ErrorPage } from "@/components/error-page";
import { runServiceQuery } from "@/utils/supabase-run";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "All of Our Awesome Admins",
  description: "List of all of our admins in the KCL Dungeons and Dragons society.",
  openGraph: {
    title: "All of Our Awesome Admins",
    description: "List of all of our admins in the KCL Dungeons and Dragons society.",
  },
};

export default async function Page() {
  const dms = await runServiceQuery((supabase) => supabase.from("admins").select("*, users(*)"));
  if (dms.isErr()) return <ErrorPage error={dms.error.message} caller="/admins/page.tsx" />;

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      <TypographyH1>Admins</TypographyH1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {dms.value.map((dm, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{dm.users.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <TypographyParagraph>{dm.about}</TypographyParagraph>
            </CardContent>
            <CardFooter className="flex flex-row justify-end">
              <Button asChild size="sm" variant="default">
                <Link href={`/admins/${dm.users.username}`}>View Profile</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
