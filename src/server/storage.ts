"use server";

import { resultAsyncToActionResult } from "@/types/error-typing";
import { runQuery } from "@/utils/supabase-run";
import { upload } from "@/lib/storage";

export const uploadImageParty = async ({
  blob,
  file,
  partyId,
  partyShortened,
}: {
  blob: Blob;
  file: File;
  partyId: string;
  partyShortened: string;
}) =>
  resultAsyncToActionResult(
    upload({
      blob,
      file,
      shortened: partyShortened,
    }).andThen(({ id }) =>
      runQuery((supabase) =>
        supabase.from("parties").update({ image_uuid: id }).eq("id", partyId).select("name").single(),
      ),
    ),
  );

export const uploadImageCharacter = async ({
  blob,
  file,
  characterId,
  characterShortened,
}: {
  blob: Blob;
  file: File;
  characterId: string;
  characterShortened: string;
}) =>
  resultAsyncToActionResult(
    upload({
      blob,
      file,
      shortened: characterShortened,
    }).andThen(({ id }) =>
      runQuery((supabase) =>
        supabase.from("characters").update({ image_uuid: id }).eq("id", characterId).select("name").single(),
      ),
    ),
  );

export const uploadImagePlayer = async ({
  blob,
  file,
  playerId,
  playerShortened,
}: {
  blob: Blob;
  file: File;
  playerId: string;
  playerShortened: string;
}) =>
  resultAsyncToActionResult(
    upload({
      blob,
      file,
      shortened: playerShortened,
    }).andThen(({ id }) =>
      runQuery((supabase) => supabase.from("players").update({ image_uuid: id }).eq("id", playerId)),
    ),
  );

export const uploadImageDM = async ({
  blob,
  file,
  DMId,
  DMShortened,
}: {
  blob: Blob;
  file: File;
  DMId: string;
  DMShortened: string;
}) =>
  resultAsyncToActionResult(
    upload({
      blob,
      file,
      shortened: DMShortened,
    }).andThen(({ id }) => runQuery((supabase) => supabase.from("dms").update({ image_uuid: id }).eq("id", DMId))),
  );
