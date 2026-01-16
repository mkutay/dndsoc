import z from "zod";

import { Constants } from "@/types/database.types";

export const Thingy = Constants.public.Enums.thingy_type;
export type ThingyType = (typeof Thingy)[number];

const thingySchema = z.object({
  name: z.string().min(1, "Name is required.").max(100, "Name must be less than 100 characters."),
  description: z.string(),
  public: z.boolean(),
  tags: z.array(
    z.object({
      value: z.enum(Thingy),
    }),
  ),
});

export const addThingySchema = thingySchema.extend({
  characterId: z.uuid(),
});

export const editThingySchema = addThingySchema.extend({
  thingyId: z.uuid(),
});
