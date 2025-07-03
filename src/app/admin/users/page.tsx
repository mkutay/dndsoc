import { Metadata } from "next";
import Link from "next/link";

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TypographyH1 } from "@/components/typography/headings";
import { Button } from "@/components/ui/button";
import { ErrorPage } from "@/components/error-page";
import { rolesLabel } from "@/types/full-database.types";
import { runQuery } from "@/utils/supabase-run";

export const metadata: Metadata = {
  title: "Admin View: All of Our Users",
  description: "List of all of our users in the KCL Dungeons and Dragons app.",
  openGraph: {
    title: "Admin View: All of Our Users",
    description: "List of all of our users in the KCL Dungeons and Dragons app.",
  },
};

export default async function Page() {
  const users = await getUsers();
  if (users.isErr()) return <ErrorPage error={users.error} caller="/admin/users/page.tsx" />;

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      <TypographyH1>Users</TypographyH1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {users.value.map((user, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>
                {user.name} ({user.username})
              </CardTitle>
              <CardDescription>{rolesLabel.find((val) => val.value === user.roles?.role)?.label}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" size="default" asChild>
                <Link href={`/admin/users/${user.username}`}>View User</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

const getUsers = () => runQuery((supabase) => supabase.from("users").select("*, roles(*)"));
