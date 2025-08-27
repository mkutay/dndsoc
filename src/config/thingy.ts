import z from "zod";

import { Constants } from "@/types/database.types";

export const Thingy = Constants.public.Enums.thingy_type;
export type ThingyType = (typeof Thingy)[number];

export const addThingySchema = z.object({
  name: z.string().min(1, "Name is required.").max(100, "Name must be less than 100 characters."),
  description: z.string(),
  public: z.boolean(),
  // amount: z
  //   .number({ error: "Write an actual number." })
  //   .int({ error: "Write an actual integer." })
  //   .min(1, "Amount must be at least 1."),
  tags: z.array(
    z.object({
      value: z.enum(Thingy),
    }),
  ),
});

export const editThingySchema = z.object({
  name: z.string().min(1, "Name is required.").max(100, "Name must be less than 100 characters."),
  description: z.string(),
  public: z.boolean(),
  tags: z.array(
    z.object({
      value: z.enum(Thingy),
    }),
  ),
});
