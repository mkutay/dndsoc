import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TypographyH1 } from "@/components/typography/headings";
import { getUsers } from "@/lib/users/query-all";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Page() {
  const users = await getUsers();
  if (users.isErr()) {
    console.error(users.error);
    return;
  }

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose my-12 px-4">
      <TypographyH1>Users</TypographyH1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        {users.value.map((user, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{user.username}</CardTitle>
              <CardDescription>{user.roles?.role}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" size="default" asChild>
                <Link href={`/admin/users/${user.username}`}>
                  View User
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}