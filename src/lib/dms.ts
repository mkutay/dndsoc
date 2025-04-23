import { runQuery } from "@/utils/supabase-run";
import { DM } from "@/types/full-database.types";
import { getUser } from "./auth";

type DMArgument = {
  auth_user_uuid: string;
  about?: string;
  level?: number;
};

export const getDMs = () =>
  runQuery((supabase) => supabase
    .from("dms")
    .select("*, users(*)")
  );

export const getDMByUsername = ({ username }: { username: string }) => 
  runQuery<DM>((supabase) => supabase
    .from("dms")
    .select(`*, users!inner(*), received_achievements_dm(*, achievements(*))`)
    .eq("users.username", username)
    .single()
  );

export const insertDM = (dm: DMArgument) =>
  runQuery((supabase) => supabase
    .from("dms")
    .upsert(dm, { onConflict: "auth_user_uuid", ignoreDuplicates: false })
    .select("*")
    .single()
  );

export const getDMUser = () => 
  getUser()
  .andThen((user) => 
    runQuery((supabase) => supabase
      .from("dms")
      .select(`*, users(*)`)
      .eq("auth_user_uuid", user.id)
      .single()
    )
  )