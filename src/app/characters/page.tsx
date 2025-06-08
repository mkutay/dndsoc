import { Metadata } from "next";

import { ErrorPage } from "@/components/error-page";
import { TypographyH1 } from "@/components/typography/headings";
import { CharacterCards } from "@/components/character-cards";
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
      <CharacterCards characters={characters.value} />
    </div>
  );
}