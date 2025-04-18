import { runQuery } from "@/utils/supabase-run";

export const getUsers = () => 
  runQuery((supabase) => supabase
    .from("users")
    .select("*, roles(*)")
  )