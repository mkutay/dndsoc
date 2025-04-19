import { Edit } from "lucide-react";
import Link from "next/link";

import { getUser } from "@/lib/auth/user";
import { Button } from "./ui/button";

export async function PlayerEditButton({ authUserUuid }: { authUserUuid: string }) {
  const userResult = await getUser();
  if (userResult.isErr() || userResult.value.id !== authUserUuid) {
    return null;
  }

  return (
    <Button asChild variant="outline" size="icon">
      <Link href={`/players/edit`}>
        <Edit />
      </Link>
    </Button>
  );
}