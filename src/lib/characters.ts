import { runQuery } from "@/utils/supabase-run";

type GetCharacterByShortenedError = {
  message: string;
  code: "NOT_FOUND";
};

export const getCharacterByShortened = ({ shortened }: { shortened: string }) =>
  runQuery((supabase) => supabase
    .from("characters")
    .select("*, races(*), classes(*)")
    .eq("shortened", shortened)
    .single()
  )
  .mapErr((error) => error.message.includes("PGRST116")
    ? {
        message: "Character not found.",
        code: "NOT_FOUND",
      } as GetCharacterByShortenedError
    : error
  );

export const getCharacterPlayerByShortened = ({ shortened }: { shortened: string }) =>
  runQuery((supabase) => supabase
    .from("characters")
    .select("*, races(*), classes(*), players(*, users(*))")
    .eq("shortened", shortened)
    .single()
  );

export const deleteCharacterClass = ({ characterId }: { characterId: string; }) => 
  runQuery((supabase) =>
    supabase
      .from("character_class")
      .delete()
      .eq("character_id", characterId),
    "deleteCharacterClass"
  );

export const getCharacters = () =>
  runQuery((supabase) => supabase
    .from("characters")
    .select("*, races(*), classes(*), players!inner(*, users(*))")
  );

export const getCharactersByPlayerUuid = ({ playerUuid }: { playerUuid: string }) =>
  runQuery((supabase) => supabase
    .from("characters")
    .select(`*`)
    .eq("player_uuid", playerUuid)
  );

export const upsertCharacterClass = ({
  classes
}: {
  classes: {
    character_id: string,
    class_id: string,
  }[]
}) =>
  runQuery((supabase) => supabase
    .from("character_class")
    .upsert(classes, { ignoreDuplicates: false })
  )