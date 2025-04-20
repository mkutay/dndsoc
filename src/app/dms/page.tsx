import Link from "next/link";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TypographyParagraph } from "@/components/typography/paragraph";
import { TypographyH1 } from "@/components/typography/headings";
import { ErrorPage } from "@/components/error-page";
import { getDMs } from "@/lib/dms";

export const dynamic = "force-dynamic";

export default async function Page() {
  const dms = await getDMs();
  if (!dms.isOk()) return <ErrorPage error={dms.error.message} />;

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose my-12 px-4">
      <TypographyH1>DMs — the GOATs</TypographyH1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        {dms.value.map((dm, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{dm.users.username}</CardTitle>
              <CardDescription>Level {dm.level}</CardDescription>
            </CardHeader>
            <CardContent>
              <TypographyParagraph>
                {dm.about || "No about available."}
              </TypographyParagraph>
            </CardContent>
            <CardFooter className="flex flex-row justify-end">
              <Button asChild size="sm" variant="default">
                <Link href={`/dms/${dm.users.username}`}>
                  View Profile
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}