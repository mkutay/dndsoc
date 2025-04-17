import { TypographyH1 } from "@/components/typography/headings";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Page() {
  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose my-12 px-4">
      <TypographyH1>Admin Page</TypographyH1>
      <Button variant="default" size="lg" asChild className="mt-6 w-fit">
        <Link href="/admin/users">
          View Users
        </Link>
      </Button>
    </div>
  );
}