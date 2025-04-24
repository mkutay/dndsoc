import Link from "next/link";

import { TypographyH1 } from "@/components/typography/headings";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Page",
  description: "Admin page for managing users and other admin tasks.",
  openGraph: {
    title: "Admin Page",
    description: "Admin page for managing users and other admin tasks.",
  },
};

export default function Page() {
  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      <TypographyH1>Admin Page</TypographyH1>
      <Button variant="default" size="lg" asChild className="mt-6 w-fit">
        <Link href="/admin/users">
          View Users
        </Link>
      </Button>
    </div>
  );
}