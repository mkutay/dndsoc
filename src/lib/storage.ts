import { errAsync, fromSafePromise, ok, okAsync } from "neverthrow";

import { createClient } from "@/utils/supabase/server";
import { createClient as createClientSync } from "@/utils/supabase/client";
import { runQuery } from "@/utils/supabase-run";

export const getPublicUrl = ({ path }: { path: string }) => {
  if (path.startsWith("http")) return ok(path);

  return createClientSync().andThen((supabase) =>
    ok(supabase.storage.from("profile-images").getPublicUrl(path).data.publicUrl),
  );
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

export const upload = ({ file, shortened, folder }: { file: File; shortened: string; folder: string }) => {
  const filename = folder + "/" + shortened + "-" + crypto.randomUUID() + "-" + file.name;

  const storage = createClient()
    .andThen((supabase) => fromSafePromise(supabase.storage.from("profile-images").upload(filename, file)))
    .andThen((response) =>
      response.error
        ? errAsync({
            message: `Failed to upload image: ${response.error.message}.`,
            code: "STORAGE_UPLOAD_ERROR",
          } as UploadError)
        : okAsync(response.data),
    )
    .andThrough((data) =>
      runQuery((supabase) =>
        supabase.from("images").insert({
          id: data.id,
          name: data.path,
        }),
      ),
    );

  return storage;
};

export const uploadImagePlayer = ({
  image,
  shortened,
  playerUuid,
}: {
  image: File;
  shortened: string;
  playerUuid: string;
}) =>
  upload({
    file: image,
    shortened,
    folder: "players",
  }).andThen(({ id }) =>
    runQuery((supabase) => supabase.from("players").update({ image_uuid: id }).eq("id", playerUuid)),
  );

export const uploadImageParty = ({ file, partyId, shortened }: { file: File; partyId: string; shortened: string }) =>
  upload({
    file,
    shortened,
    folder: "parties",
  }).andThen(({ id }) =>
    runQuery((supabase) =>
      supabase.from("parties").update({ image_uuid: id }).eq("id", partyId).select("name").single(),
    ),
  );

export const uploadImageCharacter = ({
  file,
  characterId,
  shortened,
}: {
  file: File;
  characterId: string;
  shortened: string;
}) =>
  upload({
    file,
    shortened,
    folder: "characters",
  }).andThen(({ id }) =>
    runQuery((supabase) =>
      supabase.from("characters").update({ image_uuid: id }).eq("id", characterId).select("name").single(),
    ),
  );

export const uploadImageDM = ({ file, DMId, shortened }: { file: File; DMId: string; shortened: string }) =>
  upload({
    file,
    shortened,
    folder: "dms",
  }).andThen(({ id }) => runQuery((supabase) => supabase.from("dms").update({ image_uuid: id }).eq("id", DMId)));
