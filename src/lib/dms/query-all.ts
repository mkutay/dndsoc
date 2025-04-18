import { runQuery } from "@/utils/supabase-run";

export const getDMs = () =>
  runQuery((supabase) => supabase
    .from("dms")
    .select("*, users(*)")
  )