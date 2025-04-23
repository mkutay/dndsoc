import { Player } from "@/types/full-database.types";
import { runQuery } from "@/utils/supabase-run";

type PlayerArgument = {
  about?: string;
  id?: string;
  level?: number;
  auth_user_uuid: string;
};

export const insertPlayer = (player: PlayerArgument) =>
  runQuery((supabase) =>
    supabase
      .from("players")
      .insert(player)
      .select("*")
      .single()
  );

export const upsertPlayer = (player: PlayerArgument) =>
  runQuery((supabase) =>
    supabase
      .from("players")
      .upsert(player, { onConflict: "auth_user_uuid", ignoreDuplicates: false })
      .select("*")
      .single()
  );

export const getPlayers = () => 
  runQuery<Player[]>(
    supabase => 
      supabase
        .from("players")
        .select("*, users(*), received_achievements_player(*, achievements(*))"),
    "getPlayers" // Add the function name for error reporting
  );


export const getPlayerAuthUserUuid = ({ authUserUuid }: { authUserUuid: string }) => 
  runQuery<Player>((supabase) =>
    supabase
      .from("players")
      .select(`*, users(*), received_achievements_player(*, achievements(*))`)
      .eq("auth_user_uuid", authUserUuid)
      .single()
  );

export const getPlayerByUsername = ({ username }: { username: string }) =>
  runQuery<Player>((supabase) =>
    supabase
      .from("players")
      .select(`*, users!inner(*), received_achievements_player(*, achievements(*))`)
      .eq("users.username", username)
      .single()
  );