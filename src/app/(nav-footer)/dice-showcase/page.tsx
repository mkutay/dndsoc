import type { Metadata } from "next";

import { D10Dice } from "@/components/dice/d10-3d";
import { D12Dice } from "@/components/dice/d12-3d";
import { D20Dice } from "@/components/dice/d20-3d";
import { D4Dice } from "@/components/dice/d4-3d";
import { D6Dice } from "@/components/dice/d6-3d";
import { D8Dice } from "@/components/dice/d8-3d";
import { TypographyH1 } from "@/components/typography/headings";
import { TypographyParagraph } from "@/components/typography/paragraph";

export const metadata: Metadata = {
  title: "Dice Showcase",
  description: "Explore various 3D dice in action",
  openGraph: {
    title: "Dice Showcase",
    description: "Explore various 3D dice in action",
  },
};

export default function Page() {
  return (
    <div className="max-w-6xl container mx-auto px-4 py-8">
      <TypographyH1>Dice Showcase</TypographyH1>
      <TypographyParagraph>Here you can see various 3D dice in action:</TypographyParagraph>
      <div className="flex flex-row flex-wrap gap-24 mt-2 justify-center">
        <D20Dice size="lg" />
        <D12Dice size="lg" />
        <D10Dice size="lg" />
        <D8Dice size="lg" />
        <D6Dice size="lg" />
        <D4Dice size="lg" />
      </div>
    </div>
  );
}
