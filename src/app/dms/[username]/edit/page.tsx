import { TypographyH1 } from "@/components/typography/headings";
import { TypographyLink } from "@/components/typography/paragraph";
import { ErrorPage } from "@/components/error-page";
import { DMEditForm } from "./form";
import DB from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const role = await DB.Roles.Get.With.User();
  if (role.isErr()) return <ErrorPage error={role.error} caller="/dms/[username]/edit page" />;

  const dm = await DB.DMs.Get.Username({ username });
  if (dm.isErr()) return <ErrorPage error={dm.error} caller="/dms/[username]/edit page" isNotFound />;

  if (role.value.role !== "admin" && role.value.auth_user_uuid !== dm.value.auth_user_uuid) {
    return <ErrorPage error="You are not authorized to edit this DM." caller="/dms/[username]/edit page" isForbidden />;
  }

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose my-12 px-4">
      <TypographyLink href={`/dms/${dm.value.users.username}`} className="tracking-wide font-quotes">
        Go back
      </TypographyLink>
      <TypographyH1 className="mt-0.5">Edit Your Public DM Page</TypographyH1>
      <DMEditForm dm={dm.value} />
    </div>
  );
}