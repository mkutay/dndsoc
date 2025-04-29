import { TypographyHr } from "@/components/typography/blockquote";
import { TypographyH1 } from "@/components/typography/headings";
import { TypographyList } from "@/components/typography/list";
import { TypographyLink, TypographyParagraph } from "@/components/typography/paragraph";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="lg:max-w-6xl max-w-prose mx-auto px-4 lg:my-12 mt-6 mb-12">
      <TypographyH1>
        <span className="font-drop-caps">T</span>his is a HIGHLY work in progress app.
      </TypographyH1>
      <TypographyParagraph className="max-w-prose">
        I hope to be done with this project before the start of the next semester — before DnD sessions properly start.
      </TypographyParagraph>
      <TypographyParagraph className="max-w-prose">
        This is going to be an amazing tool for our society, and I am really excited.
      </TypographyParagraph>
      <TypographyParagraph className="max-w-prose">
        And, it&apos;s all open source, for all you CompSci majors in our society.
      </TypographyParagraph>
      <div className="flex flex-col justify-center items-center mt-6 text-4xl font-quotes">
        <TypographyLink href="https://github.com/mkutay/dndsoc">Woo magic stuff</TypographyLink>
      </div>
      <TypographyHr className="mt-12" />
      <TypographyParagraph className="max-w-prose">
        You can sign up from the nav bar, or just browse the site throught these cool things I&apos;ve been working on
        (the data showcased are just placeholders):
      </TypographyParagraph>
      <TypographyList className="text-lg">
        <li>
          <TypographyLink href="/characters">Characters</TypographyLink> — A place to store all your characters.
        </li>
        <li>
          <TypographyLink href="/campaigns">Campaigns</TypographyLink> — See all the campaigns that are going on.
        </li>
        <li>
          <TypographyLink href="/players">Players</TypographyLink>
        </li>
        <li>
          <TypographyLink href="/dms">DMs</TypographyLink> — Our GOAT DMs.
        </li>
        <li>
          <TypographyLink href="/parties">Parties</TypographyLink>
        </li>
      </TypographyList>
      <div className="flex flex-row w-full items-center justify-end mt-6 text-4xl font-headings leading-none group">
        {/* <div className="font-serif text-primary group-hover:text-primary/80 transition-all text-2xl mb-3">§</div> */}
        <Link href="https://www.mkutay.dev" className="flex flex-row items-baseline text-primary group-hover:text-primary/80 transition-all">
          <span className="font-drop-caps mr-1 text-5xl">K</span>
          <span>utay, the President</span>
        </Link>
      </div>
    </main>
  );
}
