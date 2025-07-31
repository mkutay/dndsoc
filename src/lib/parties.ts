import { runQuery } from "@/utils/supabase-run";

export const getParties = () =>
  runQuery((supabase) =>
    supabase.from("parties").select(`*, dm_party(*, dms!inner(*)), character_party(*, characters!inner(*))`),
  );
