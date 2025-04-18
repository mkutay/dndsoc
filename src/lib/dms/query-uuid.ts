import { Tables } from "@/types/database.types";
import { runQuery } from "@/utils/supabase-run";

type DM = Tables<"dms">;

export const getDMByUuid = (uuid: string) =>
  runQuery<DM>((supabase) => supabase
    .from("dms")
    .select("*")
    .eq("auth_user_uuid", uuid)
    .single()
  );