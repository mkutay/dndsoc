"use server";

import type z from "zod";

import { addThingySchema, editThingySchema } from "@/config/thingy";
import { resultAsyncToActionResult } from "@/types/error-typing";
import { parseSchema } from "@/utils/parse-schema";
import { runQuery } from "@/utils/supabase-run";
import { convertToShortened } from "@/utils/formatting";

export const insertThingy = async (values: z.infer<typeof addThingySchema>, characterUuid: string) =>
  resultAsyncToActionResult(
    parseSchema(addThingySchema, values).asyncAndThen((parsed) => {
      const id = crypto.randomUUID();
      const shortened = convertToShortened(parsed.name);
      return runQuery(
        (supabase) =>
          supabase.from("thingy").insert({
            id,
            name: parsed.name,
            description: parsed.description,
            tags: parsed.tags.map((tag) => tag.value),
            shortened,
            character_id: characterUuid,
            public: parsed.public,
          }),
        "INSERT_THINGY",
      ).map(() => ({ shortened }));
    }),
  );

export const editThingy = async (values: z.infer<typeof editThingySchema>, characterUuid: string, thingyId: string) =>
  resultAsyncToActionResult(
    parseSchema(addThingySchema, values)
      .asyncAndThen((parsed) => {
        const id = crypto.randomUUID();
        const shortened = convertToShortened(parsed.name);
        return runQuery(
          (supabase) =>
            supabase.from("thingy").insert({
              id,
              name: parsed.name,
              description: parsed.description,
              tags: parsed.tags.map((tag) => tag.value),
              shortened,
              previous: thingyId,
              character_id: characterUuid,
              public: parsed.public,
            }),
          "INSERT_THINGY",
        ).map(() => ({ shortened, id }));
      })
      .andThrough(({ id }) =>
        runQuery(
          (supabase) =>
            supabase
              .from("thingy")
              .update({
                next: id,
              })
              .eq("id", thingyId),
          "UPDATE_THINGY",
        ),
      )
      .map(({ shortened }) => ({ shortened })),
  );
