import { Edit } from "lucide-react";
import Link from "next/link";

import { getUser } from "@/lib/users/user";
import { Button } from "./ui/button";
import { getPlayerByAuthUuid } from "@/lib/players/query-uuid";

export async function CharacterEditButton({ playerUuid, shortened }: { playerUuid: string, shortened: string }) {
  const userResult = await getUser();
  if (userResult.isErr()) {
    return null;
  }
  const user = userResult.value;
  
  const playerResult = await getPlayerByAuthUuid(user.id);
  if (playerResult.isErr()) {
    return null;
  }
  const player = playerResult.value;

  if (player.id !== playerUuid) {
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