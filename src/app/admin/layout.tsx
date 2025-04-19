import { redirect } from "next/navigation";

import { getUserRole } from "@/lib/roles";
import { ErrorPage } from "@/components/error-page";

export const dynamic = "force-dynamic";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const role = await getUserRole();
  if (role.isErr()) return <ErrorPage error={role.error} caller="/admin/layout.tsx" />;

  if (role.value.role !== "admin") {
    redirect("/");
  }

  return (
    <>
      {children}
    </>
  );
}