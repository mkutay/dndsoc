import { createClient } from "@/utils/supabase/server";
import { errAsync, fromPromise, okAsync } from "neverthrow";

type UpsertCharacterClassError = {
  message: string;
  code: "DATABASE_ERROR";
}

export const upsertCharacterClass = ({
  classes
}: {
  classes: {
    character_id: string,
    class_id: string,
  }[]
}) =>
  createClient()
  .andThen((supabase) =>
    fromPromise(
      supabase
        .from("character_class")
        .upsert(classes, { ignoreDuplicates: false }),
      (error) => ({
        message: `Failed to update character_class table: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: "DATABASE_ERROR",
      } as UpsertCharacterClassError)
    )
  )
  .andThen((response) => 
    !response.error
      ? okAsync()
      : errAsync({
          message: "Failed to update character_class table: " + response.error.message,
          code: "DATABASE_ERROR",
        } as UpsertCharacterClassError)
  );