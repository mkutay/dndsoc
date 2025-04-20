import { runQuery } from "@/utils/supabase-run";

export const getPartyByDMUuid = ({ DMUuid }: { DMUuid: string }) =>
  runQuery((supabase) => supabase
    .from("parties")
    .select(`*, dm_party!inner(*, dms!inner(*))`)
    .eq("dm_party.dms.id", DMUuid),
  );