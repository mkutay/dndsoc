import { runQuery } from "@/utils/supabase-run";

export const upsertRace = ({ race }: { race: string }) =>
  runQuery((supabase) => supabase
    .from("races")
    .upsert({ name: race }, { ignoreDuplicates: false, onConflict: "name" })
    .select("*")
    .single()
  )