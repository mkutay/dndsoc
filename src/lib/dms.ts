import { runQuery } from "@/utils/supabase-run";
import { Tables } from "@/types/database.types";
import { getUserByUsername } from "@/lib/users";

type DM = Tables<"dms">;

export const getDMs = () =>
  runQuery((supabase) => supabase
    .from("dms")
    .select("*, users(*)")
  );

export const getDMByUsername = (username: string) => 
  getUserByUsername(username)
    .andThen((user) => getDMByUuid(user.auth_user_uuid));

export const getDMByUuid = (uuid: string) =>
  runQuery<DM>((supabase) => supabase
    .from("dms")
    .select("*")
    .eq("auth_user_uuid", uuid)
    .single()
  );