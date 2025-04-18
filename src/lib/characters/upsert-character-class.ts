import { runQuery } from "@/utils/supabase-run";

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