import { runQuery } from "@/utils/supabase-run";

export const getCharacterPlayerByShortened = ({ shortened }: { shortened: string }) =>
  runQuery((supabase) =>
    supabase
      .from("characters")
      .select(
        "*, races(*), classes(*), players(*, users(*)), received_achievements_character(*, achievements(*)), character_party(*, parties(*))",
      )
      .eq("shortened", shortened)
      .single(),
  );

export const deleteCharacterClass = ({ characterId }: { characterId: string }) =>
  runQuery(
    (supabase) => supabase.from("character_class").delete().eq("character_id", characterId),
    "deleteCharacterClass",
  );

export const getCharacters = () =>
  runQuery((supabase) => supabase.from("characters").select("*, races(*), classes(*), players!inner(*, users(*))"));

export const getCharactersByAuthUuid = ({ authUuid }: { authUuid: string }) =>
  runQuery((supabase) =>
    supabase
      .from("characters")
      .select("*, races(*), classes(*), players!inner(*)")
      .eq("players.auth_user_uuid", authUuid),
  );
