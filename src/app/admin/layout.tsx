import { redirect } from "next/navigation";

import { ErrorPage } from "@/components/error-page";
import DB from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const role = await DB.Roles.Get.With.User();
  if (role.isErr()) return <ErrorPage error={role.error} caller="/admin/layout.tsx" isForbidden />;

  if (role.value.role !== "admin") {
    redirect("/");
  }

  return (
    <>
      {children}
    </>
  );
}