import { redirect } from "next/navigation";

import { TypographyH1 } from "@/components/typography/headings";
import { TypographyLink } from "@/components/typography/paragraph";
import { ErrorPage } from "@/components/error-page";
import { getDMUser } from "@/lib/dms";
import { DMEditForm } from "./form";

export const dynamic = "force-dynamic";

export default async function Page() {
  const result = await getDMUser();

  if (result.isErr()) {
    if (result.error.message.includes("Auth session missing!")) redirect("/sign-in");
    return <ErrorPage error={result.error} caller="/players/edit page" />;
  }

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose my-12 px-4">
      <TypographyLink href={`/dms/${result.value.users.username}`}>
        Go back
      </TypographyLink>
      <TypographyH1 className="mt-2">Edit Your Public DM Page</TypographyH1>
      <DMEditForm dm={result.value} />
    </div>
  );
}