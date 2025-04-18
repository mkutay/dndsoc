import { redirect } from "next/navigation";

import { getUser } from "@/lib/auth/user";
import { getRole } from "@/lib/roles";

export const dynamic = 'force-dynamic';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  if (user.isErr()) {
    console.error(user.error);
    redirect("/");
  }

  const userRole = await getRole({ authUuid: user.value.id });
  if (userRole.isErr()) {
    console.error(userRole.error);
    redirect("/");
  }

  if (userRole.value.role !== "admin") {
    redirect("/");
  }

  return (
    <>
      {children}
    </>
  );
}