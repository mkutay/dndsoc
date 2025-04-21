import { Edit } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getDMUser } from "@/lib/dms";

export async function PartyEditButton({ DMUuids, shortened }: { DMUuids: string[], shortened: string }) {
  const userResult = await getDMUser();
  if (userResult.isErr() || !DMUuids.includes(userResult.value.id)) {
    return null;
  }

  return (
    <Button asChild variant="outline" size="icon">
      <Link href={`/parties/${shortened}/edit`}>
        <Edit />
      </Link>
    </Button>
  );
}