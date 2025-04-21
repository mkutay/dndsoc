import { runQuery } from "@/utils/supabase-run";

export const getCharacters = () =>
  runQuery((supabase) => supabase
    .from("characters")
    .select("*, races(*), classes(*), players!inner(*, users(*))")
  )