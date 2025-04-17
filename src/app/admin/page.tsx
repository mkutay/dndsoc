import { TypographyH1 } from "@/components/typography/headings";

export default async function Page() {
  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose my-12 px-4">
      <TypographyH1>Admin Page</TypographyH1>
    </div>
  );
}