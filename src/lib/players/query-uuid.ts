import { runQuery } from "@/utils/supabase-run";

export const getPlayerByUuid = ({ uuid }: { uuid: string }) =>
  runQuery((supabase) =>
    supabase
      .from("players")
      .select("*, users(*)")
      .eq("id", uuid)
      .single()
  );