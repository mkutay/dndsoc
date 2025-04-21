import { Edit } from "lucide-react";
import Link from "next/link";

import { getPlayerAuthUserUuid } from "@/lib/players/query-auth-user-uuid";
import { Button } from "./ui/button";
import { getUserRole } from "@/lib/roles";

export async function CharacterEditButton({ playerUuid, shortened }: { playerUuid: string | null, shortened: string }) {
  const userResult = await getUserRole();
  if (userResult.isErr()) {
    return null;
  }
  
  if (userResult.value.role !== "admin") {
    const playerResult = await getPlayerAuthUserUuid({ authUserUuid: userResult.value.auth_user_uuid });
    if (playerResult.isErr() || playerResult.value.id !== playerUuid) {
      return null;
    }
  }

  return (
    <Button asChild variant="outline" size="icon">
      <Link href={`/characters/${shortened}/edit`}>
        <Edit />
      </Link>
    </Button>
  );
}