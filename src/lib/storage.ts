import { okAsync } from "neverthrow";

import { createClient } from "@/utils/supabase/server";
import { runQuery } from "@/utils/supabase-run";

type TransformOptions = {
  width?: number;
  height?: number;
  quality?: number;
  resize?: 'cover' | 'contain' | 'fill';
}

export const getPublicUrl = ({ path, transform }: { path: string, transform?: TransformOptions }) => {
  if (path.startsWith("http")) return okAsync(path);

  return createClient()
    .andThen((supabase) => okAsync(supabase
      .storage
      .from("profile-images")
      .getPublicUrl(path, {
        transform
      })
      .data.publicUrl
    ));
}

export const getPublicUrlByUuid = ({ imageUuid, transform }: { imageUuid: string, transform?: TransformOptions }) => {
  return runQuery((supabase) => supabase
    .from("images")
    .select("*")
    .eq("id", imageUuid)
    .single()
  )
  .andThen((result) =>
    getPublicUrl({ path: result.name, transform })
  )
}