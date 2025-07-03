import { errAsync, fromSafePromise, okAsync } from "neverthrow";

import { createClient } from "@/utils/supabase/server";
import { createClient as createClientSync } from "@/utils/supabase/client";
import { runQuery } from "@/utils/supabase-run";

export const getPublicUrl = ({ path }: { path: string }) => {
  if (path.startsWith("http")) return okAsync(path);

  return createClient().andThen((supabase) =>
    okAsync(supabase.storage.from("profile-images").getPublicUrl(path).data.publicUrl),
  );
};

export const getPublicUrlByPathSync = ({ path }: { path: string }) => {
  if (path.startsWith("http")) return path;
  return createClientSync().storage.from("profile-images").getPublicUrl(path).data.publicUrl;
};

export const getPublicUrlByUuid = ({ imageUuid }: { imageUuid: string }) => {
  return runQuery((supabase) => supabase.from("images").select("*").eq("id", imageUuid).single()).andThen((result) =>
    getPublicUrl({ path: result.name }),
  );
};

type UploadError = {
  message: string;
  code: "STORAGE_UPLOAD_ERROR";
};

export const upload = ({ blob, file, shortened }: { blob: Blob; file: File; shortened: string }) => {
  const filename = shortened + "-" + crypto.randomUUID() + "-" + file.name;

  const storage = createClient()
    .andThen((supabase) => fromSafePromise(supabase.storage.from("profile-images").upload(filename, blob)))
    .andThen((response) =>
      response.error
        ? errAsync({
            message: `Failed to upload image: ${response.error.message}.`,
            code: "STORAGE_UPLOAD_ERROR",
          } as UploadError)
        : okAsync(response.data),
    )
    .andThen((data) =>
      runQuery((supabase) =>
        supabase
          .from("images")
          .insert({
            id: data.path,
            name: data.path,
          })
          .select("*")
          .single(),
      ),
    );

  return storage;
};
