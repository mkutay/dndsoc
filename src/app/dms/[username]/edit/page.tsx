import { TypographyH1 } from "@/components/typography/headings";
import { TypographyLink } from "@/components/typography/paragraph";
import { ErrorPage } from "@/components/error-page";
import { getDMByUsername } from "@/lib/dms";
import { DMEditForm } from "./form";
import { getUserRole } from "@/lib/roles";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const role = await getUserRole();
  if (role.isErr()) return <ErrorPage error={role.error} caller="/dms/[username]/edit page" />;

  const dm = await getDMByUsername({ username });
  if (dm.isErr()) return <ErrorPage error={dm.error} caller="/dms/[username]/edit page" />;

  if (role.value.role !== "admin" && role.value.auth_user_uuid !== dm.value.auth_user_uuid) {
    return <ErrorPage error="You are not authorized to edit this DM." caller="/dms/[username]/edit page" />;
  }

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose my-12 px-4">
      <TypographyLink href={`/dms/${dm.value.users.username}`}>
        Go back
      </TypographyLink>
      <TypographyH1 className="mt-2">Edit Your Public DM Page</TypographyH1>
      <DMEditForm dm={dm.value} />
    </div>
  );
}