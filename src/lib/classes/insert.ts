import { createClient } from "@/utils/supabase/server";
import { errAsync, fromPromise, okAsync } from "neverthrow";

type InsertClassesError = {
  message: string;
  code: "DATABASE_ERROR";
};

export const insertClasses = ({
  classes,
}: {
  classes: {
    name: string;
  }[];
}) => 
  createClient()
  .andThen((supabase) =>
    fromPromise(
      supabase
        .from("classes")
        .upsert(
          classes,
          { ignoreDuplicates: false, onConflict: "name" },
        )
        .select("*"),
      (error) => ({
        message: `Failed to update classes table: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: "DATABASE_ERROR",
      } as InsertClassesError)
    )
  )
  .andThen((response) => 
    !response.error
      ? okAsync(response.data)
      : errAsync({
          message: "Failed to update classes table: " + response.error.message,
          code: "DATABASE_ERROR",
        } as InsertClassesError)
  )