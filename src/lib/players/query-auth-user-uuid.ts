import { Player } from "@/types/full-database.types";
import { runQuery } from "@/utils/supabase-run";

export const getPlayerAuthUserUuid = ({ authUserUuid }: { authUserUuid: string }) => 
  runQuery<Player>((supabase) =>
    supabase
      .from("players")
      .select(`*, users(*), received_achievements_player(*, achievements(*))`)
      .eq("auth_user_uuid", authUserUuid)
      .single()
  );