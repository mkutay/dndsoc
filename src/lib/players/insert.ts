import { Tables } from "@/types/database.types";
import { runQuery } from "@/utils/supabase-run";

type Player = Tables<"players">;
type PlayerArgument = {
  about?: string;
  id?: string;
  level?: number;
  auth_user_uuid: string;
};

export const insertPlayer = (player: PlayerArgument) =>
  runQuery<Player>((supabase) =>
    supabase
      .from("players")
      .insert(player)
      .select("*")
      .single()
  )

export const upsertPlayer = (player: PlayerArgument) =>
  runQuery<Player>((supabase) =>
    supabase
      .from("players")
      .upsert(player, { onConflict: "auth_user_uuid", ignoreDuplicates: false })
      .select("*")
      .single()
  );