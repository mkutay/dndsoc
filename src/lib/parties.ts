import { runQuery } from "@/utils/supabase-run";

export const getPartyByDMUuid = ({ DMUuid }: { DMUuid: string }) =>
  runQuery((supabase) => supabase
    .from("parties")
    .select(`*, dm_party!inner(*, dms!inner(*))`)
    .eq("dm_party.dms.id", DMUuid),
  );

export const getParties = () =>
  runQuery((supabase) => supabase
    .from("parties")
    .select(`*, dm_party(*, dms!inner(*)), character_party(*, characters!inner(*))`),
  );

export const getPartyByShortened = ({ shortened }: { shortened: string }) =>
  runQuery((supabase) => supabase
    .from("parties")
    .select(`*, dm_party(*, dms!inner(*, users(*))), character_party(*, characters!inner(*)), party_campaigns(*, campaigns!inner(*))`)
    .eq("shortened", shortened)
    .single(),
  );