import { runQuery } from "@/utils/supabase-run";

export const getParties = () =>
  runQuery((supabase) =>
    supabase.from("parties").select(`*, dm_party(*, dms!inner(*)), character_party(*, characters!inner(*))`),
  );

export const getPartyByShortened = ({ shortened }: { shortened: string }) =>
  runQuery((supabase) =>
    supabase
      .from("parties")
      .select(
        `*, dm_party(*, dms!inner(*, users(*))), character_party(*, characters!inner(*, races(*), classes(*), players!inner(*, users(*)))), party_campaigns(*, campaigns!inner(*))`,
      )
      .eq("shortened", shortened)
      .single(),
  );

export const getPartiesByPlayerAuthUuid = ({ authUuid }: { authUuid: string }) =>
  runQuery((supabase) =>
    supabase
      .from("parties")
      .select("*, character_party!inner(*, characters!inner(*, players!inner(*)))")
      .eq("character_party.characters.players.auth_user_uuid", authUuid),
  );
