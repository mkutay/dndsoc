import { Character } from "@/types/full-database.types";
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