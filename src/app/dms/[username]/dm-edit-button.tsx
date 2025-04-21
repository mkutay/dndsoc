import { Edit } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getUserRole } from "@/lib/roles";

export async function DMEditButton({ authUserUuid, username }: { authUserUuid: string, username: string }) {
  const role = await getUserRole();
  if (role.isErr()) return null;
  if (role.value.role !== "admin" && role.value.auth_user_uuid !== authUserUuid) return null;

  return (
    <Button asChild variant="outline" size="icon">
      <Link href={`/dms/${username}/edit`}>
        <Edit />
      </Link>
    </Button>
  );
}