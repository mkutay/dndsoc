import { forbidden } from "next/navigation";

import { ErrorPage } from "@/components/error-page";
import { getUserRole } from "@/lib/roles";

export const dynamic = "force-dynamic";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await getUserRole();
  if (user.isErr()) {
    return user.error.code === "NOT_LOGGED_IN" ? forbidden() : <ErrorPage error={user.error} />;
  }

  if (user.value.role !== "admin") {
    return forbidden();
  }

  return children;
}
