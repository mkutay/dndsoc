import { Edit } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import DB from "@/lib/db";

export async function PartyEditButton({ DMUuids, shortened }: { DMUuids: string[], shortened: string }) {
  const role = await DB.Roles.Get.With.User();
  if (role.isErr()) return null;

  if (role.value.role !== "admin") {
    const userResult = await DB.DMs.Get.With.User();
    if (userResult.isErr() || !DMUuids.includes(userResult.value.id)) {
      return null;
    }
  }

  return (
    <Button asChild variant="outline" size="icon">
      <Link href={`/parties/${shortened}/edit`}>
        <Edit />
      </Link>
    </Button>
  );
}