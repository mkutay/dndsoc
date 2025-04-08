import { createClient } from "@/utils/supabase/server";
import { errAsync, fromPromise, okAsync } from "neverthrow";

type DeleteCharacterClassError = {
  message: string;
  code: "DATABASE_ERROR";
}

export const deleteCharacterClass = ({ characterId }: { characterId: string; }) => 
  createClient()
  .andThen((supabase) => 
    fromPromise(
      supabase
        .from("character_class")
        .delete()
        .eq("character_id", characterId),
      (error) => ({
        message: `Failed to delete in the character_class table: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: "DATABASE_ERROR",
      } as DeleteCharacterClassError)
    )
  )
  .andThen((response) => 
    !response.error
      ? okAsync()
      : errAsync({
          message: "Failed to delete in the character_class table: " + response.error.message,
          code: "DATABASE_ERROR",
        } as DeleteCharacterClassError)
  );