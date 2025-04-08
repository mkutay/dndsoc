import { Edit } from "lucide-react";
import Link from "next/link";

import { getPlayerAuthUserUuid } from "@/lib/players/query-auth-user-uuid";
import { getUser } from "@/lib/auth/user";
import { Button } from "./ui/button";

export async function CharacterEditButton({ playerUuid, shortened }: { playerUuid: string, shortened: string }) {
  const userResult = await getUser();
  if (userResult.isErr()) {
    return null;
  }
  
  const playerResult = await getPlayerAuthUserUuid({ authUserUuid: userResult.value.id });
  if (playerResult.isErr()) {
    return null;
  }

  if (playerResult.value.id !== playerUuid) {
    return null;
  }

  return (
    <Button asChild variant="outline" size="icon">
      <Link href={`/characters/${shortened}/edit`}>
        <Edit />
      </Link>
    </Button>
  );
}