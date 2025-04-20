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
    .select(`*, dm_party!inner(*, dms!inner(*)), character_party!inner(*, characters!inner(*))`),
  );

export const getPartyByShortened = ({ shortened }: { shortened: string }) =>
  runQuery((supabase) => supabase
    .from("parties")
    .select(`*, dm_party!inner(*, dms!inner(*, users(*))), character_party!inner(*, characters!inner(*)), party_campaigns!inner(*, campaigns!inner(*))`)
    .eq("shortened", shortened)
    .single(),
  );