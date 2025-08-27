import { getUser } from "./auth";
import { runQuery } from "@/utils/supabase-run";

type DMArgument = {
  auth_user_uuid: string;
  about?: string;
  level?: number;
};

export const getDMs = () => runQuery((supabase) => supabase.from("dms").select("*, users(*)"));

export const insertDM = (dm: DMArgument) =>
  runQuery((supabase) =>
    supabase.from("dms").upsert(dm, { onConflict: "auth_user_uuid", ignoreDuplicates: false }).select("*").single(),
  );

export const getDMUser = () =>
  getUser().andThen((user) =>
    runQuery((supabase) => supabase.from("dms").select(`*, users(*)`).eq("auth_user_uuid", user.id).single()),
  );

export const getDMByUsername = ({ username }: { username: string }) =>
  runQuery((supabase) =>
    supabase
      .from("dms")
      .select(`*, users!inner(*), received_achievements_dm(*, achievements(*)), dm_party(*, parties(*)), images(*)`)
      .eq("users.username", username)
      .single(),
  );
