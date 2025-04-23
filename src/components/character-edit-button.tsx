import { Edit } from "lucide-react";
import Link from "next/link";

import { Button } from "./ui/button";
import DB from "@/lib/db";

export async function CharacterEditButton({ playerUuid, shortened }: { playerUuid: string | null, shortened: string }) {
  const userResult = await DB.Roles.Get.With.User();
  if (userResult.isErr()) {
    return null;
  }
  
  if (userResult.value.role !== "admin") {
    const playerResult = await DB.Players.Get.Auth({ authUserUuid: userResult.value.auth_user_uuid });
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