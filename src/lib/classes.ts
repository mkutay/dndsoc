import { runQuery } from "@/utils/supabase-run";

export const insertClasses = ({
  classes,
}: {
  classes: {
    name: string;
  }[];
}) => 
  runQuery((supabase) => supabase
    .from("classes")
    .upsert(
      classes,
      { ignoreDuplicates: false, onConflict: "name" },
    )
    .select("*")
  )